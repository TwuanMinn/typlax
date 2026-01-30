'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MODES } from '@/data/modes'
import { Mode } from '@/types'

// Container animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.3,
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
}

// Mode card component with TypeVibe-inspired design
function ModeCard({
    mode,
    isSelected,
    isLocked = false,
    onSelect,
    onHover
}: {
    mode: Mode
    isSelected: boolean
    isLocked?: boolean
    onSelect: () => void
    onHover: (hovering: boolean) => void
}) {
    return (
        <motion.div
            className="group relative min-w-[260px] w-[260px] h-[380px] snap-center cursor-pointer"
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !isLocked && onSelect()}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            {/* Card container */}
            <div className={`
                relative h-full rounded-[2rem] overflow-hidden
                bg-white/5 border transition-all duration-300
                ${isSelected
                    ? 'border-primary-glow shadow-[0_0_30px_rgba(107,95,255,0.4)]'
                    : 'border-white/10 hover:border-primary-glow/50 hover:shadow-[0_0_20px_rgba(107,95,255,0.2)]'
                }
            `}>
                {/* Background image */}
                <div
                    className="h-[65%] w-full relative overflow-hidden"
                >
                    {/* Actual image background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                            backgroundImage: `url(${mode.image})`,
                        }}
                    />

                    {/* Gradient overlay for readability */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)`,
                        }}
                        initial={{ opacity: 0.5 }}
                        whileHover={{ opacity: 0.3 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Decorative particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full bg-white/30"
                                style={{
                                    left: `${20 + i * 15}%`,
                                    top: `${30 + (i % 3) * 20}%`,
                                }}
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.2, 0.5, 0.2],
                                }}
                                transition={{
                                    duration: 2 + i * 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                }}
                            />
                        ))}
                    </div>

                    {/* Lock overlay for locked modes */}
                    {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <motion.div
                                className="bg-black/80 p-4 rounded-full border border-white/20"
                                whileHover={{ scale: 1.1 }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            </motion.div>
                        </div>
                    )}

                    {/* Active badge */}
                    {isSelected && !isLocked && (
                        <motion.div
                            className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary-glow border border-primary-glow/30"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            Selected
                        </motion.div>
                    )}

                    {/* Mode icon */}
                    <motion.div
                        className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: `${mode.colors.primary}30` }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        {mode.icon}
                    </motion.div>
                </div>

                {/* Content area */}
                <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-b from-white/5 to-transparent">
                    <div>
                        <motion.h3
                            className={`text-xl font-display font-bold mb-2 transition-colors duration-300 ${isLocked ? 'text-white/50' : 'text-primary-text group-hover:text-primary-glow'
                                }`}
                        >
                            {mode.name}
                        </motion.h3>
                        <p className={`text-sm leading-relaxed ${isLocked ? 'text-white/30' : 'text-primary-text/60'}`}>
                            {mode.description}
                        </p>
                    </div>

                    {/* Preview hint */}
                    {!isLocked && (
                        <motion.div
                            className="flex items-center gap-2 text-primary-glow mt-3"
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider">Play Now</span>
                            <motion.svg
                                width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <path d="M3 8H13M13 8L9 4M13 8L9 12" />
                            </motion.svg>
                        </motion.div>
                    )}

                    {isLocked && (
                        <p className="text-xs text-white/30 mt-3">
                            Unlocks at Level 15
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default function SelectPage() {
    const router = useRouter()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
    const [hoveredMode, setHoveredMode] = useState<Mode | null>(null)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = parseInt(e.key)
            if (key >= 1 && key <= MODES.length) {
                const mode = MODES[key - 1]
                handleModeSelect(mode)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleModeSelect = (mode: Mode) => {
        setSelectedMode(mode)
        setIsTransitioning(true)

        // Navigate after animation
        setTimeout(() => {
            router.push(`/play?mode=${mode.id}`)
        }, 800)
    }

    // Use hovered or selected mode for background color
    const activeMode = hoveredMode || selectedMode

    return (
        <main className="min-h-screen bg-[#0a0a12] flex flex-col overflow-hidden relative">
            {/* Animated background gradient */}
            <motion.div
                className="fixed inset-0 pointer-events-none"
                animate={{
                    background: activeMode
                        ? `radial-gradient(ellipse at center, ${activeMode.colors.primary}15 0%, transparent 50%)`
                        : 'radial-gradient(ellipse at center, rgba(107, 95, 255, 0.05) 0%, transparent 50%)',
                }}
                transition={{ duration: 0.5 }}
            />

            {/* Floating particles background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Transition overlay */}
            <AnimatePresence>
                {isTransitioning && selectedMode && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{
                            background: `linear-gradient(135deg, ${selectedMode.colors.primary} 0%, ${selectedMode.colors.secondary} 100%)`,
                        }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-4"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <motion.div
                                className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <h2 className="font-display text-4xl font-bold text-white">
                                {selectedMode.name}
                            </h2>
                            <p className="text-white/60">Preparing your experience...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.header
                className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.img
                        src="/images/logo.png"
                        alt="Typlax Logo"
                        className="w-16 h-16 rounded-xl shadow-lg shadow-primary-glow/30"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                    />
                    <span className="text-2xl font-display font-bold text-primary-text">Typlax</span>
                </Link>

                {/* Right side controls */}
                <div className="flex items-center gap-3">
                    {/* Stats badge */}
                    <motion.div
                        className="hidden md:flex items-center h-10 px-4 rounded-full bg-white/5 border border-white/10"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="text-sm font-bold text-primary-text/80">Lvl 1</span>
                        <div className="w-px h-4 bg-white/20 mx-3" />
                        <span className="text-xs font-medium text-primary-glow">0 WPM</span>
                    </motion.div>

                    {/* Settings */}
                    <motion.button
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary-text/60 hover:text-primary-text hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    </motion.button>

                    {/* Profile */}
                    <Link href="/login">
                        <motion.button
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary-text/60 hover:text-primary-text hover:bg-white/10 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </motion.button>
                    </Link>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center relative z-10 px-4 md:px-12">
                {/* Page heading */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-text mb-4"
                        animate={{ opacity: isTransitioning ? 0.3 : 1 }}
                    >
                        Select Your{' '}
                        <span className="text-primary-glow italic">Vibe</span>
                    </motion.h1>
                    <motion.p
                        className="text-primary-text/60 text-lg max-w-lg mx-auto"
                        animate={{ opacity: isTransitioning ? 0.3 : 1 }}
                    >
                        Choose a visual theme that reacts to your typing flow.
                        Unlock new aesthetics as you level up.
                    </motion.p>
                </motion.div>

                {/* Horizontal Gallery */}
                <div className="relative group/gallery w-full">
                    {/* Edge fade gradients */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a12] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a12] to-transparent z-10 pointer-events-none" />

                    {/* Scroll container */}
                    <motion.div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto pb-8 pt-4 px-20 snap-x snap-mandatory scrollbar-hide justify-start lg:justify-center"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {MODES.map((mode, index) => (
                            <ModeCard
                                key={mode.id}
                                mode={mode}
                                isSelected={selectedMode?.id === mode.id}
                                isLocked={false} // Add lock logic based on user level
                                onSelect={() => handleModeSelect(mode)}
                                onHover={(hovering) => setHoveredMode(hovering ? mode : null)}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* CTA Button */}
                <motion.div
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <motion.button
                        onClick={() => selectedMode && handleModeSelect(selectedMode)}
                        className="flex items-center justify-center h-14 px-8 rounded-full 
                                   bg-gradient-to-r from-primary-glow to-purple-500 text-white
                                   font-display font-bold text-lg gap-3
                                   shadow-[0_0_30px_rgba(107,95,255,0.4)]
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedMode}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(107, 95, 255, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Start Typing</span>
                    </motion.button>
                </motion.div>

                {/* Keyboard hint */}
                <motion.p
                    className="text-center text-sm text-primary-text/40 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isTransitioning ? 0 : 1 }}
                    transition={{ delay: 1 }}
                >
                    Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">1-{MODES.length}</kbd> to quick select
                </motion.p>
            </div>

            {/* Footer */}
            <motion.footer
                className="relative z-10 flex flex-col gap-3 py-6 text-center border-t border-white/5 bg-[#0a0a12]/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href="/" className="text-primary-text/50 hover:text-primary-glow text-sm font-medium transition-colors">
                        Home
                    </Link>
                    <Link href="/leaderboard" className="text-primary-text/50 hover:text-primary-glow text-sm font-medium transition-colors">
                        Leaderboard
                    </Link>
                    <Link href="/history" className="text-primary-text/50 hover:text-primary-glow text-sm font-medium transition-colors">
                        Progress
                    </Link>
                </div>
                <p className="text-primary-text/30 text-xs">© 2026 Typlax. Crafted for focus.</p>
            </motion.footer>
        </main>
    )
}
