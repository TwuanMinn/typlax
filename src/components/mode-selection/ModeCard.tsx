'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mode, Difficulty } from '@/types'
import { useState } from 'react'

interface ModeCardProps {
    mode: Mode
    index: number
    onSelect?: () => void
}

const difficultyColors = {
    beginner: 'bg-accent-success/20 text-accent-success',
    medium: 'bg-accent-warning/20 text-accent-warning',
    hard: 'bg-accent-error/20 text-accent-error',
}

const difficultyLabels = {
    beginner: 'Beginner',
    medium: 'Medium',
    hard: 'Hard',
}

export function ModeCard({ mode, index, onSelect }: ModeCardProps) {
    const router = useRouter()
    const [isHovered, setIsHovered] = useState(false)

    // 3D tilt effect
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 })

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set(e.clientX - centerX)
        y.set(e.clientY - centerY)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }

    const handleClick = () => {
        if (onSelect) {
            onSelect()
        } else {
            router.push(`/play?mode=${mode.id}`)
        }
    }

    return (
        <motion.button
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="mode-card relative w-full aspect-[4/3] rounded-2xl overflow-hidden
                 border border-white/10 cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-primary-glow focus:ring-offset-2 focus:ring-offset-primary-bg"
            style={{
                background: `linear-gradient(135deg, ${mode.colors.primary} 0%, ${mode.colors.secondary} 100%)`,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Animated gradient shine effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                }}
                animate={{
                    x: isHovered ? ['100%', '-100%'] : '100%',
                }}
                transition={{
                    duration: 0.8,
                    ease: 'easeInOut',
                }}
            />

            {/* Gradient overlay for text readability */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                animate={{ opacity: isHovered ? 0.8 : 1 }}
                transition={{ duration: 0.3 }}
            />

            {/* Mode illustration with floating animation */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: 'translateZ(40px)' }}
                animate={{
                    y: isHovered ? [0, -8, 0] : 0,
                }}
                transition={{
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    ease: 'easeInOut',
                }}
            >
                <ModeIllustration modeId={mode.id} isHovered={isHovered} />
            </motion.div>

            {/* Glowing orb effect on hover */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${mode.colors.accent}40 0%, transparent 70%)`,
                }}
                animate={{
                    scale: isHovered ? [1, 1.3, 1] : 0,
                    opacity: isHovered ? [0.5, 0.8, 0.5] : 0,
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Content with slide-up effect */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{ transform: 'translateZ(30px)' }}
            >
                <motion.div
                    className="flex items-center gap-2 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                >
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[mode.difficulty]}`}>
                        {difficultyLabels[mode.difficulty]}
                    </span>
                </motion.div>
                <motion.h3
                    className="font-display text-xl font-semibold text-white mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                >
                    {mode.name}
                </motion.h3>
                <motion.p
                    className="text-sm text-white/70 font-body"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                >
                    {mode.description}
                </motion.p>
            </motion.div>
        </motion.button>
    )
}

// Simple SVG illustrations for each mode with animation support
function ModeIllustration({ modeId, isHovered }: { modeId: string; isHovered: boolean }) {
    const iconVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.5, ease: 'easeInOut' }
        }
    }

    switch (modeId) {
        case 'tree-growing':
            return (
                <motion.svg viewBox="0 0 100 100" className="w-24 h-24 text-white/30">
                    <motion.path
                        d="M50 90 L50 50 M50 50 Q30 40 35 20 Q50 30 50 50 Q50 30 65 20 Q70 40 50 50"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        initial="hidden"
                        animate="visible"
                        variants={iconVariants}
                    />
                </motion.svg>
            )
        case 'egg-to-bird':
            return (
                <motion.svg viewBox="0 0 100 100" className="w-24 h-24 text-white/30">
                    <motion.ellipse
                        cx="50" cy="55" rx="25" ry="30"
                        stroke="currentColor" strokeWidth="3" fill="none"
                        initial="hidden"
                        animate="visible"
                        variants={iconVariants}
                    />
                </motion.svg>
            )
        case 'broken-glass':
            return (
                <motion.svg viewBox="0 0 100 100" className="w-24 h-24 text-white/30">
                    <motion.path
                        d="M20 20 L50 50 L80 20 M20 80 L50 50 L80 80 M50 10 L50 50 L50 90"
                        stroke="currentColor" strokeWidth="2" fill="none"
                        initial="hidden"
                        animate="visible"
                        variants={iconVariants}
                    />
                </motion.svg>
            )
        case 'night-sunrise':
            return (
                <motion.svg viewBox="0 0 100 100" className="w-24 h-24 text-white/30">
                    <motion.circle
                        cx="50" cy="70" r="20"
                        stroke="currentColor" strokeWidth="3" fill="none"
                        initial="hidden"
                        animate="visible"
                        variants={iconVariants}
                    />
                    <motion.line
                        x1="50" y1="40" x2="50" y2="30"
                        stroke="currentColor" strokeWidth="2"
                        animate={{ opacity: isHovered ? [1, 0.5, 1] : 1 }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.line x1="75" y1="55" x2="85" y2="45" stroke="currentColor" strokeWidth="2" />
                    <motion.line x1="25" y1="55" x2="15" y2="45" stroke="currentColor" strokeWidth="2" />
                </motion.svg>
            )
        case 'tv-static':
            return (
                <motion.svg viewBox="0 0 100 100" className="w-24 h-24 text-white/30">
                    <motion.rect
                        x="15" y="20" width="70" height="50" rx="5"
                        stroke="currentColor" strokeWidth="3" fill="none"
                        animate={{
                            opacity: isHovered ? [1, 0.8, 1] : 1
                        }}
                        transition={{ duration: 0.1, repeat: isHovered ? Infinity : 0 }}
                    />
                    <motion.line x1="35" y1="80" x2="35" y2="70" stroke="currentColor" strokeWidth="3" />
                    <motion.line x1="65" y1="80" x2="65" y2="70" stroke="currentColor" strokeWidth="3" />
                </motion.svg>
            )
        case 'car-racing':
            return (
                <motion.svg viewBox="0 0 100 100" className="w-24 h-24 text-white/30">
                    <motion.rect
                        x="20" y="45" width="60" height="20" rx="5"
                        stroke="currentColor" strokeWidth="3" fill="none"
                        animate={{ x: isHovered ? [0, 3, 0] : 0 }}
                        transition={{ duration: 0.2, repeat: isHovered ? Infinity : 0 }}
                    />
                    <motion.circle
                        cx="30" cy="65" r="8"
                        stroke="currentColor" strokeWidth="3" fill="none"
                        animate={{ rotate: isHovered ? 360 : 0 }}
                        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, ease: 'linear' }}
                    />
                    <motion.circle
                        cx="70" cy="65" r="8"
                        stroke="currentColor" strokeWidth="3" fill="none"
                        animate={{ rotate: isHovered ? 360 : 0 }}
                        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, ease: 'linear' }}
                    />
                </motion.svg>
            )
        default:
            return null
    }
}

