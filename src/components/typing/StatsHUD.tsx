'use client'

import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface StatsHUDProps {
    progress: number
    wpm: number
    accuracy: number
}

// Animated number component
function AnimatedNumber({ value, color }: { value: number; color: string }) {
    const spring = useSpring(0, { stiffness: 100, damping: 30 })
    const display = useTransform(spring, (v) => Math.round(v))
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        spring.set(value)
    }, [spring, value])

    useEffect(() => {
        return display.on('change', (v) => setDisplayValue(v))
    }, [display])

    return (
        <motion.span
            className={`text-lg font-mono font-semibold ${color}`}
            key={displayValue}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
        >
            {displayValue}
        </motion.span>
    )
}

// Circular progress indicator
function ProgressRing({ progress }: { progress: number }) {
    const radius = 18
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <svg width="48" height="48" className="rotate-[-90deg]">
            {/* Background ring */}
            <circle
                cx="24"
                cy="24"
                r={radius}
                fill="transparent"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
            />
            {/* Progress ring */}
            <motion.circle
                cx="24"
                cy="24"
                r={radius}
                fill="transparent"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                    strokeDasharray: circumference,
                }}
            />
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6b5fff" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export function StatsHUD({ progress, wpm, accuracy }: StatsHUDProps) {
    const getAccuracyColor = (acc: number) => {
        if (acc >= 95) return 'text-accent-success'
        if (acc >= 85) return 'text-accent-warning'
        return 'text-accent-error'
    }

    const getWPMColor = (wpm: number) => {
        if (wpm >= 60) return 'text-accent-success'
        if (wpm >= 40) return 'text-accent-warning'
        return 'text-primary-text'
    }

    return (
        <motion.div
            className="stats-hud fixed bottom-6 left-6 flex items-center gap-4 px-5 py-3
                       bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
                       shadow-lg shadow-black/20"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            {/* Progress ring with percentage */}
            <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <ProgressRing progress={progress} />
                <span className="absolute text-xs font-mono font-semibold text-primary-text">
                    {Math.round(progress)}%
                </span>
            </motion.div>

            {/* Separator */}
            <div className="w-px h-8 bg-white/10" />

            {/* WPM stat */}
            <motion.div
                className="text-center min-w-[60px]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <p className="text-xs text-primary-text/50 mb-0.5 font-body uppercase tracking-wider">WPM</p>
                <AnimatedNumber value={wpm} color={getWPMColor(wpm)} />
            </motion.div>

            {/* Accuracy stat */}
            <motion.div
                className="text-center min-w-[60px]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <p className="text-xs text-primary-text/50 mb-0.5 font-body uppercase tracking-wider">ACC</p>
                <div className="flex items-center justify-center gap-0.5">
                    <AnimatedNumber value={accuracy} color={getAccuracyColor(accuracy)} />
                    <span className={`text-sm ${getAccuracyColor(accuracy)}`}>%</span>
                </div>
            </motion.div>

            {/* Subtle pulse effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-primary-glow/5 pointer-events-none"
                animate={{
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </motion.div>
    )
}

