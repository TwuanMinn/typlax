'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/stores'
import { getModeById } from '@/data/modes'
import { formatTime } from '@/lib/utils'

type HistoryEntry = {
    id: string
    mode: string
    wpm: number
    accuracy: number
    time: number
    errors: number
    date: string
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
}

const statCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
}

export default function HistoryPage() {
    const { recentResults } = useGameStore()
    const [history, setHistory] = useState<HistoryEntry[]>([])
    const [stats, setStats] = useState({
        totalTests: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        bestWpm: 0,
        totalTime: 0,
    })

    useEffect(() => {
        // Convert store results to history entries
        const localHistory = recentResults.map((r, i) => ({
            id: `local-${i}`,
            mode: r.mode,
            wpm: r.finalWPM,
            accuracy: r.accuracy,
            time: r.timeSeconds,
            errors: r.errorCount,
            date: new Date(r.timestamp).toLocaleDateString(),
        }))
        setHistory(localHistory)

        // Calculate stats
        if (localHistory.length > 0) {
            const totalWpm = localHistory.reduce((sum, h) => sum + h.wpm, 0)
            const totalAcc = localHistory.reduce((sum, h) => sum + h.accuracy, 0)
            const totalTime = localHistory.reduce((sum, h) => sum + h.time, 0)
            const bestWpm = Math.max(...localHistory.map(h => h.wpm))

            setStats({
                totalTests: localHistory.length,
                avgWpm: Math.round(totalWpm / localHistory.length),
                avgAccuracy: Math.round(totalAcc / localHistory.length),
                bestWpm,
                totalTime,
            })
        }
    }, [recentResults])

    const statCards = [
        { label: 'Tests', value: stats.totalTests, color: 'text-primary-glow', icon: '📊' },
        { label: 'Avg WPM', value: stats.avgWpm, color: 'text-green-400', icon: '⚡' },
        { label: 'Avg Accuracy', value: `${stats.avgAccuracy}%`, color: 'text-blue-400', icon: '🎯' },
        { label: 'Best WPM', value: stats.bestWpm, color: 'text-yellow-400', icon: '🏆' },
        { label: 'Total Time', value: formatTime(stats.totalTime), color: 'text-purple-400', icon: '⏱️' },
    ]

    return (
        <main className="min-h-screen bg-[#0a0a12] py-12 px-6 relative overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-green-500/5 blur-[100px] top-20 -right-20"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full bg-primary-glow/5 blur-[80px] -bottom-20 left-20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-primary-text/50 hover:text-primary-text transition-all duration-300 group"
                    >
                        <motion.span animate={{ x: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                            ←
                        </motion.span>
                        <span className="group-hover:translate-x-1 transition-transform">Back</span>
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/select"
                            className="px-5 py-2.5 bg-gradient-to-r from-primary-glow to-purple-500 text-white rounded-xl font-medium
                                       shadow-[0_0_20px_rgba(107,95,255,0.3)] hover:shadow-[0_0_30px_rgba(107,95,255,0.5)] transition-shadow"
                        >
                            New Test
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 mb-4"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <span className="text-3xl">📈</span>
                    </motion.div>
                    <h1 className="font-display text-4xl font-bold mb-2 text-primary-text">Your Progress</h1>
                    <p className="text-primary-text/60">Track your typing journey</p>
                </motion.div>

                {/* Stats overview */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center
                                       hover:border-white/20 hover:bg-white/[0.07] transition-all group cursor-default"
                            variants={statCardVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <motion.span
                                className="text-2xl mb-2 block"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                            >
                                {stat.icon}
                            </motion.span>
                            <p className={`text-2xl font-bold font-mono ${stat.color} group-hover:scale-110 transition-transform`}>
                                {stat.value}
                            </p>
                            <p className="text-sm text-primary-text/50 mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* History list */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-display font-semibold text-primary-text">Recent Sessions</h2>
                        <span className="text-xs text-primary-text/40">{history.length} sessions</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {history.length === 0 ? (
                            <motion.div
                                className="px-6 py-16 text-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <motion.div
                                    className="w-20 h-20 rounded-2xl bg-primary-glow/20 flex items-center justify-center mx-auto mb-4"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <span className="text-4xl">🎯</span>
                                </motion.div>
                                <p className="text-primary-text/50 mb-6">No tests completed yet</p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href="/select"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-glow to-purple-500 text-white rounded-xl font-medium
                                                   shadow-[0_0_20px_rgba(107,95,255,0.3)]"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        Start Your First Test
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="divide-y divide-white/5"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {history.map((entry) => {
                                    const mode = getModeById(entry.mode as any)
                                    return (
                                        <motion.div
                                            key={entry.id}
                                            className="px-6 py-4 hover:bg-white/5 transition-colors group cursor-pointer"
                                            variants={itemVariants}
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <motion.div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                                        style={{
                                                            background: mode
                                                                ? `linear-gradient(135deg, ${mode.colors.primary}40, ${mode.colors.secondary}40)`
                                                                : 'rgba(107, 95, 255, 0.2)'
                                                        }}
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                    >
                                                        {mode?.icon || '🎮'}
                                                    </motion.div>
                                                    <div>
                                                        <p className="font-medium text-primary-text group-hover:text-primary-glow transition-colors">
                                                            {mode?.name || entry.mode}
                                                        </p>
                                                        <p className="text-sm text-primary-text/50">{entry.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8 text-right">
                                                    <div>
                                                        <p className="font-mono font-bold text-green-400 text-lg">{entry.wpm}</p>
                                                        <p className="text-xs text-primary-text/50">WPM</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-blue-400">{entry.accuracy}%</p>
                                                        <p className="text-xs text-primary-text/50">Accuracy</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-primary-text/80">{formatTime(entry.time)}</p>
                                                        <p className="text-xs text-primary-text/50">Time</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </main>
    )
}
