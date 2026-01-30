'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { leaderboardApi } from '@/lib/api'
import { MODES } from '@/data/modes'

type TimeFilter = 'all' | 'daily' | 'weekly'
type LeaderboardEntry = {
    rank: number
    username: string
    wpm: number
    accuracy: number
    mode?: string
}

// Mock data for demo
const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'SpeedDemon', wpm: 142, accuracy: 98 },
    { rank: 2, username: 'TypeMaster', wpm: 135, accuracy: 97 },
    { rank: 3, username: 'KeyboardKing', wpm: 128, accuracy: 99 },
    { rank: 4, username: 'FlashFingers', wpm: 121, accuracy: 95 },
    { rank: 5, username: 'SwiftTyper', wpm: 118, accuracy: 96 },
    { rank: 6, username: 'RapidWriter', wpm: 112, accuracy: 94 },
    { rank: 7, username: 'QuickKeys', wpm: 108, accuracy: 93 },
    { rank: 8, username: 'AccuracyAce', wpm: 105, accuracy: 100 },
    { rank: 9, username: 'WordWizard', wpm: 98, accuracy: 97 },
    { rank: 10, username: 'TypeTitan', wpm: 95, accuracy: 96 },
]

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

export default function LeaderboardPage() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
    const [modeFilter, setModeFilter] = useState<string>('all')
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true)
            try {
                let response
                if (timeFilter === 'daily') {
                    response = await leaderboardApi.getDaily()
                } else if (modeFilter !== 'all') {
                    response = await leaderboardApi.getByMode(modeFilter)
                } else {
                    response = await leaderboardApi.getGlobal()
                }
                if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
                    setLeaderboard(response.data as LeaderboardEntry[])
                }
            } catch (err) {
                console.log('Using mock leaderboard data')
            } finally {
                setLoading(false)
            }
        }
        fetchLeaderboard()
    }, [timeFilter, modeFilter])

    const getRankStyle = (rank: number) => {
        if (rank === 1) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' }
        if (rank === 2) return { bg: 'bg-gray-400/20', text: 'text-gray-300', border: 'border-gray-400/50', glow: '' }
        if (rank === 3) return { bg: 'bg-amber-600/20', text: 'text-amber-500', border: 'border-amber-600/50', glow: '' }
        return { bg: 'bg-white/5', text: 'text-primary-text/60', border: 'border-white/10', glow: '' }
    }

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇'
        if (rank === 2) return '🥈'
        if (rank === 3) return '🥉'
        return rank
    }

    return (
        <main className="min-h-screen bg-[#0a0a12] py-12 px-6 relative overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-yellow-500/5 blur-[100px] top-0 right-0"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full bg-primary-glow/5 blur-[80px] bottom-0 left-0"
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
                            Start Typing
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
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/20 mb-4"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <span className="text-3xl">🏆</span>
                    </motion.div>
                    <h1 className="font-display text-4xl font-bold mb-2 text-primary-text">Leaderboard</h1>
                    <p className="text-primary-text/60">Top typists worldwide</p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="flex flex-wrap gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Time filter */}
                    <div className="relative flex bg-white/5 rounded-xl p-1 border border-white/10">
                        {(['all', 'daily', 'weekly'] as TimeFilter[]).map((filter) => (
                            <motion.button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize z-10 ${timeFilter === filter ? 'text-white' : 'text-primary-text/60 hover:text-primary-text'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {timeFilter === filter && (
                                    <motion.div
                                        className="absolute inset-0 bg-primary-glow rounded-lg -z-10"
                                        layoutId="timeFilter"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {filter === 'all' ? 'All Time' : filter}
                            </motion.button>
                        ))}
                    </div>

                    {/* Mode filter */}
                    <motion.select
                        value={modeFilter}
                        onChange={(e) => setModeFilter(e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl
                                   text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-glow/50
                                   cursor-pointer hover:border-white/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                    >
                        <option value="all">All Modes</option>
                        {MODES.map((mode) => (
                            <option key={mode.id} value={mode.id}>
                                {mode.name}
                            </option>
                        ))}
                    </motion.select>
                </motion.div>

                {/* Leaderboard table */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Header row */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 text-sm font-medium text-primary-text/50 border-b border-white/5">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5">Player</div>
                        <div className="col-span-3 text-right">WPM</div>
                        <div className="col-span-3 text-right">Accuracy</div>
                    </div>

                    {/* Leaderboard entries */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                className="px-6 py-12 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="w-8 h-8 border-2 border-primary-glow/30 border-t-primary-glow rounded-full mx-auto mb-3"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                                <p className="text-primary-text/50">Loading...</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="divide-y divide-white/5"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {leaderboard.map((entry, index) => {
                                    const rankStyle = getRankStyle(entry.rank)
                                    return (
                                        <motion.div
                                            key={entry.rank}
                                            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center 
                                                       hover:bg-white/5 transition-colors group cursor-pointer
                                                       ${entry.rank <= 3 ? rankStyle.glow : ''}`}
                                            variants={itemVariants}
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="col-span-1">
                                                <motion.span
                                                    className={`inline-flex items-center justify-center w-9 h-9 rounded-full border text-sm font-bold
                                                               ${rankStyle.bg} ${rankStyle.text} ${rankStyle.border}`}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {getRankIcon(entry.rank)}
                                                </motion.span>
                                            </div>
                                            <div className="col-span-5 font-medium text-primary-text group-hover:text-primary-glow transition-colors">
                                                {entry.username}
                                            </div>
                                            <div className="col-span-3 text-right">
                                                <span className="font-mono text-lg font-bold text-green-400">
                                                    {entry.wpm}
                                                </span>
                                            </div>
                                            <div className="col-span-3 text-right font-mono text-primary-text/80">
                                                {entry.accuracy}%
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Your stats CTA */}
                <motion.div
                    className="mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-primary-text/50 mb-4">
                        Want to see your name on the leaderboard?
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-primary-text rounded-xl
                                       hover:bg-white/20 transition-colors border border-white/10 hover:border-white/20"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Create Account to Track Progress
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    )
}
