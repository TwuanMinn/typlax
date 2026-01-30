'use client'

import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

interface TextDisplayProps {
    text: string
    currentPosition: number
    errors: number[]
    recentError?: boolean // For shake effect
    textSize?: 'small' | 'medium' | 'large'
}

export function TextDisplay({ text, currentPosition, errors, recentError, textSize = 'medium' }: TextDisplayProps) {
    // Calculate current word boundaries for highlighting
    const currentWordBounds = useMemo(() => {
        let wordStart = currentPosition
        let wordEnd = currentPosition

        // Find word start
        while (wordStart > 0 && text[wordStart - 1] !== ' ') {
            wordStart--
        }
        // Find word end
        while (wordEnd < text.length && text[wordEnd] !== ' ') {
            wordEnd++
        }

        return { start: wordStart, end: wordEnd }
    }, [text, currentPosition])

    return (
        <motion.div
            className={cn(
                "typing-text max-w-3xl mx-auto px-8 py-6 rounded-2xl",
                "bg-black/20 backdrop-blur-xl border border-white/5",
                "shadow-2xl shadow-black/30",
                `text-${textSize}`
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                x: recentError ? [-4, 4, -4, 4, 0] : 0,
            }}
            transition={{
                duration: recentError ? 0.4 : 0.6,
                ease: recentError ? 'easeOut' : [0.25, 0.46, 0.45, 0.94]
            }}
        >
            {/* Progress indicator line at top */}
            <motion.div
                className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary-glow to-purple-500 rounded-t-2xl"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentPosition / text.length) * 100}%` }}
                transition={{ duration: 0.1 }}
            />

            <p className="leading-loose relative">
                {text.split('').map((char, index) => {
                    const isTyped = index < currentPosition
                    const isCurrent = index === currentPosition
                    const isError = errors.includes(index)
                    const isInCurrentWord = index >= currentWordBounds.start && index < currentWordBounds.end

                    // Determine character state
                    let className = 'char-pending'
                    if (isTyped) {
                        className = isError ? 'char-incorrect' : 'char-correct'
                    } else if (isCurrent) {
                        className = 'char-current'
                    }

                    return (
                        <motion.span
                            key={index}
                            className={cn(
                                className,
                                'relative inline-block',
                                // Subtle highlight for current word
                                isInCurrentWord && !isTyped && 'opacity-90',
                                // Pop effect for just-typed characters
                                isTyped && 'transform-gpu'
                            )}
                            initial={false}
                            animate={{
                                scale: isTyped && index === currentPosition - 1 ? [1, 1.15, 1] : 1,
                                y: isTyped && index === currentPosition - 1 ? [0, -2, 0] : 0,
                            }}
                            transition={{ duration: 0.15 }}
                        >
                            {char === ' ' ? '\u00A0' : char}

                            {/* Enhanced blinking cursor */}
                            {isCurrent && (
                                <motion.span
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                                    style={{
                                        background: 'linear-gradient(90deg, #6b5fff, #a855f7)',
                                        boxShadow: '0 0 10px #6b5fff, 0 0 20px #6b5fff50',
                                    }}
                                    animate={{
                                        opacity: [1, 0.3, 1],
                                        scaleX: [1, 0.8, 1],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                />
                            )}

                            {/* Error flash effect */}
                            {isError && isTyped && (
                                <motion.span
                                    className="absolute inset-0 bg-red-500/20 rounded pointer-events-none"
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                        </motion.span>
                    )
                })}
            </p>

            {/* Glassmorphism inner glow */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
                }}
            />
        </motion.div>
    )
}

