'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const KEYBOARD_LAYOUT = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    [' '], // Spacebar
]

const KEY_WIDTHS: Record<string, string> = {
    ' ': 'w-64',
}

// Staggered animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.02,
            delayChildren: 0.3,
        },
    },
}

const keyVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
        },
    },
}

interface VirtualKeyboardProps {
    expectedKey?: string | null
    lastPressedKey?: string | null
    lastKeyCorrect?: boolean
    visible?: boolean
}

export function VirtualKeyboard({
    expectedKey,
    lastPressedKey,
    lastKeyCorrect,
    visible = true,
}: VirtualKeyboardProps) {
    if (!visible) return null

    const getKeyState = (key: string): 'idle' | 'expected' | 'correct' | 'incorrect' => {
        const normalizedKey = key.toLowerCase()
        const normalizedExpected = expectedKey?.toLowerCase()
        const normalizedPressed = lastPressedKey?.toLowerCase()

        // Check if this key was just pressed
        if (normalizedPressed === normalizedKey) {
            return lastKeyCorrect ? 'correct' : 'incorrect'
        }

        // Check if this is the expected next key
        if (normalizedExpected === normalizedKey) {
            return 'expected'
        }

        return 'idle'
    }

    return (
        <motion.div
            className="flex flex-col items-center gap-1.5 p-4 rounded-2xl 
                       bg-black/20 backdrop-blur-xl border border-white/5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                <motion.div
                    key={rowIndex}
                    className="flex gap-1.5"
                    style={{
                        marginLeft: rowIndex === 1 ? '20px' : rowIndex === 2 ? '30px' : rowIndex === 3 ? '50px' : 0
                    }}
                >
                    {row.map((key, keyIndex) => {
                        const state = getKeyState(key)
                        const isSpace = key === ' '
                        const isExpected = state === 'expected'

                        return (
                            <motion.div
                                key={key}
                                className={cn(
                                    'keyboard-key relative overflow-hidden',
                                    KEY_WIDTHS[key] || 'w-10',
                                    'h-10',
                                    state,
                                    // Enhanced styling
                                    'rounded-lg border',
                                    state === 'idle' && 'bg-white/5 border-white/10 hover:bg-white/10',
                                    state === 'expected' && 'bg-primary-glow/20 border-primary-glow/50',
                                    state === 'correct' && 'bg-accent-success/30 border-accent-success/50',
                                    state === 'incorrect' && 'bg-accent-error/30 border-accent-error/50',
                                    'transition-colors duration-150'
                                )}
                                variants={keyVariants}
                                animate={
                                    state === 'correct'
                                        ? { scale: [1, 1.15, 1], y: [0, -3, 0] }
                                        : state === 'incorrect'
                                            ? { x: [-3, 3, -3, 3, 0], rotate: [-2, 2, -2, 2, 0] }
                                            : {}
                                }
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Pulse effect for expected key */}
                                {isExpected && (
                                    <motion.div
                                        className="absolute inset-0 rounded-lg bg-primary-glow/20"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                )}

                                {/* Ripple effect on press */}
                                {(state === 'correct' || state === 'incorrect') && (
                                    <motion.div
                                        className={cn(
                                            "absolute inset-0 rounded-lg",
                                            state === 'correct' ? 'bg-accent-success' : 'bg-accent-error'
                                        )}
                                        initial={{ scale: 0, opacity: 0.5 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                )}

                                <span className="select-none relative z-10 font-mono text-sm font-medium text-primary-text">
                                    {isSpace ? '' : key.toUpperCase()}
                                </span>

                                {/* Glow effect for expected key */}
                                {isExpected && (
                                    <div
                                        className="absolute inset-0 pointer-events-none rounded-lg"
                                        style={{
                                            boxShadow: '0 0 15px rgba(107, 95, 255, 0.5), inset 0 0 10px rgba(107, 95, 255, 0.2)',
                                        }}
                                    />
                                )}
                            </motion.div>
                        )
                    })}
                </motion.div>
            ))}

            {/* Keyboard hint */}
            <motion.p
                className="text-xs text-primary-text/30 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                Focus on the highlighted key
            </motion.p>
        </motion.div>
    )
}

