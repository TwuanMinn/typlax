'use client'

import { useSearchParams } from 'next/navigation'
import { motion, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { getModeById } from '@/data/modes'
import { ModeId } from '@/types'
import { formatTime } from '@/lib/utils'
import { Confetti } from '@/components/ui/Confetti'
import { useState, useEffect } from 'react'

// Animated counter component
function AnimatedCounter({ value, suffix = '', delay = 0 }: { value: number; suffix?: string; delay?: number }) {
    const [displayValue, setDisplayValue] = useState(0)
    const spring = useSpring(0, { stiffness: 50, damping: 20 })
    const display = useTransform(spring, (v) => Math.round(v))

    useEffect(() => {
        const timeout = setTimeout(() => {
            spring.set(value)
        }, delay * 1000)
        return () => clearTimeout(timeout)
    }, [spring, value, delay])

    useEffect(() => {
        return display.on('change', (v) => setDisplayValue(v))
    }, [display])

    return <span>{displayValue}{suffix}</span>
}

// Stagger animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.4,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
}

export default function ResultsPage() {
    const searchParams = useSearchParams()

    const modeId = searchParams.get('mode') as ModeId
    const wpm = parseInt(searchParams.get('wpm') || '0')
    const accuracy = parseInt(searchParams.get('accuracy') || '0')
    const time = parseInt(searchParams.get('time') || '0')
    const errors = parseInt(searchParams.get('errors') || '0')

    const mode = getModeById(modeId)

    // Determine performance rank
    const getRank = () => {
        if (wpm >= 80 && accuracy >= 95) return { rank: 'S', color: 'text-yellow-400', glow: 'shadow-yellow-400/50' }
        if (wpm >= 60 && accuracy >= 90) return { rank: 'A', color: 'text-accent-success', glow: 'shadow-accent-success/50' }
        if (wpm >= 40 && accuracy >= 85) return { rank: 'B', color: 'text-blue-400', glow: 'shadow-blue-400/50' }
        if (wpm >= 30 && accuracy >= 80) return { rank: 'C', color: 'text-accent-warning', glow: 'shadow-accent-warning/50' }
        return { rank: 'D', color: 'text-primary-text/60', glow: '' }
    }

    const { rank, color: rankColor, glow } = getRank()

    // Determine performance message
    const getPerformanceMessage = () => {
        if (wpm >= 80 && accuracy >= 95) return "Outstanding! You're a typing master! 🏆"
        if (wpm >= 60 && accuracy >= 90) return "Excellent work! Keep it up! ⭐"
        if (wpm >= 40 && accuracy >= 85) return "Good job! Practice makes perfect! 💪"
        if (wpm >= 30) return "Nice effort! Keep practicing! 🌟"
        return "Great start! You'll improve in no time! 🚀"
    }

    // Color coding
    const getWPMColor = () => {
        if (wpm >= 80) return 'text-accent-success'
        if (wpm >= 50) return 'text-accent-warning'
        return 'text-primary-text'
    }

    const getAccuracyColor = () => {
        if (accuracy >= 95) return 'text-accent-success'
        if (accuracy >= 85) return 'text-accent-warning'
        return 'text-accent-error'
    }

    // Show confetti for excellent performance
    const isExcellent = wpm >= 60 && accuracy >= 90

    return (
        <main
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
            style={{
                background: mode
                    ? `linear-gradient(135deg, ${mode.colors.primary}80 0%, #0f0f1e 100%)`
                    : 'linear-gradient(135deg, #1a1a3e 0%, #0f0f1e 100%)',
            }}
        >
            {/* Animated background circles */}
            <motion.div
                className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ background: mode?.colors.primary || '#6b5fff', opacity: 0.1 }}
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Confetti celebration */}
            <Confetti isActive={isExcellent} />

            {/* Rank display */}
            <motion.div
                className="mb-6 relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                <div className={`w-28 h-28 rounded-full bg-black/30 backdrop-blur-xl border-2 border-white/10
                                flex items-center justify-center shadow-2xl ${glow}`}>
                    <motion.span
                        className={`text-5xl font-display font-black ${rankColor}`}
                        animate={isExcellent ? {
                            textShadow: ['0 0 20px currentColor', '0 0 40px currentColor', '0 0 20px currentColor']
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {rank}
                    </motion.span>
                </div>
                {/* Rotating ring for S rank */}
                {rank === 'S' && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-yellow-400/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                )}
            </motion.div>

            {/* Completion visual */}
            <motion.div
                className="mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
                <motion.div
                    className="w-16 h-16 rounded-full bg-accent-success/20 flex items-center justify-center"
                    animate={isExcellent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <motion.svg
                        className="w-8 h-8 text-accent-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        />
                    </motion.svg>
                </motion.div>
            </motion.div>

            {/* Mode name */}
            <motion.h2
                className="text-lg text-primary-text/60 font-body mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {mode?.name || 'Session'} Complete
            </motion.h2>

            {/* Performance message */}
            <motion.p
                className="text-2xl font-display font-semibold text-primary-text mb-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                {getPerformanceMessage()}
            </motion.p>

            {/* Stats grid */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* WPM */}
                <motion.div
                    className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl text-center px-6 py-5
                               hover:bg-black/30 transition-colors group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <p className="text-xs text-primary-text/50 mb-1 font-body uppercase tracking-wider">WPM</p>
                    <p className={`text-4xl font-mono font-bold ${getWPMColor()} group-hover:scale-110 transition-transform`}>
                        <AnimatedCounter value={wpm} delay={0.5} />
                    </p>
                </motion.div>

                {/* Accuracy */}
                <motion.div
                    className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl text-center px-6 py-5
                               hover:bg-black/30 transition-colors group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <p className="text-xs text-primary-text/50 mb-1 font-body uppercase tracking-wider">Accuracy</p>
                    <p className={`text-4xl font-mono font-bold ${getAccuracyColor()} group-hover:scale-110 transition-transform`}>
                        <AnimatedCounter value={accuracy} suffix="%" delay={0.6} />
                    </p>
                </motion.div>

                {/* Time */}
                <motion.div
                    className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl text-center px-6 py-5
                               hover:bg-black/30 transition-colors group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <p className="text-xs text-primary-text/50 mb-1 font-body uppercase tracking-wider">Time</p>
                    <p className="text-4xl font-mono font-bold text-primary-text group-hover:scale-110 transition-transform">
                        {formatTime(time)}
                    </p>
                </motion.div>

                {/* Errors */}
                <motion.div
                    className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl text-center px-6 py-5
                               hover:bg-black/30 transition-colors group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <p className="text-xs text-primary-text/50 mb-1 font-body uppercase tracking-wider">Errors</p>
                    <p className={`text-4xl font-mono font-bold ${errors === 0 ? 'text-accent-success' : 'text-accent-error'} group-hover:scale-110 transition-transform`}>
                        <AnimatedCounter value={errors} delay={0.8} />
                    </p>
                </motion.div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href={`/play?mode=${modeId}`}
                        className="inline-block px-8 py-3 rounded-full font-display font-semibold
                                   bg-gradient-to-r from-primary-glow to-purple-500 text-white
                                   shadow-lg shadow-primary-glow/30
                                   transition-shadow hover:shadow-xl hover:shadow-primary-glow/40"
                    >
                        Retry This Mode
                    </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="/select"
                        className="inline-block px-8 py-3 rounded-full font-display font-semibold
                                   bg-white/10 text-primary-text border border-white/10
                                   hover:bg-white/20 transition-colors"
                    >
                        Try Another Mode
                    </Link>
                </motion.div>
            </motion.div>

            {/* Back to home */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 text-sm text-primary-text/40 hover:text-primary-text 
                               transition-all duration-300 hover:gap-3"
                >
                    <motion.span
                        animate={{ x: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        ←
                    </motion.span>
                    Back to Home
                </Link>
            </motion.div>
        </main>
    )
}

