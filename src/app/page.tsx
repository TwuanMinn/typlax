'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ParticleBackground } from '@/components/landing/ParticleBackground'
import { useState, useEffect, useCallback, useRef } from 'react'

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
}

// Feature data with better icons and descriptions
const features = [
    {
        title: 'Focus',
        description: 'Immerse yourself in distraction-free typing with ambient sounds and visual feedback.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="12" r="7" strokeDasharray="4 3" />
                <circle cx="12" cy="12" r="10" strokeDasharray="2 4" opacity="0.5" />
            </svg>
        ),
        gradient: 'from-blue-500/20 to-cyan-500/20',
        glowColor: 'rgba(56, 189, 248, 0.2)',
        borderHover: 'hover:border-cyan-500/40',
    },
    {
        title: 'Type',
        description: 'Watch your keystrokes transform into living visuals that respond to your speed and accuracy.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <line x1="6" y1="10" x2="6" y2="10.01" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="10" x2="10" y2="10.01" strokeWidth="2" strokeLinecap="round" />
                <line x1="14" y1="10" x2="14" y2="10.01" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="10" x2="18" y2="10.01" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="14" x2="16" y2="14" strokeLinecap="round" />
            </svg>
        ),
        gradient: 'from-primary-glow/20 to-purple-500/20',
        glowColor: 'rgba(107, 95, 255, 0.2)',
        borderHover: 'hover:border-primary-glow/40',
    },
    {
        title: 'Transform',
        description: 'Level up your typing skills while unlocking stunning visual themes and achievements.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" />
            </svg>
        ),
        gradient: 'from-amber-500/20 to-orange-500/20',
        glowColor: 'rgba(251, 191, 36, 0.2)',
        borderHover: 'hover:border-amber-500/40',
    },
]

// Premium 3D Tilt Card Component
function FeatureCard({
    title,
    description,
    icon,
    gradient,
    glowColor,
    borderHover,
    index
}: {
    title: string
    description: string
    icon: React.ReactNode
    gradient: string
    glowColor: string
    borderHover: string
    index: number
}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { stiffness: 150, damping: 20 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set((e.clientX - centerX) / rect.width)
        mouseY.set((e.clientY - centerY) / rect.height)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
        setIsHovered(false)
    }

    return (
        <motion.div
            ref={cardRef}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
            }}
        >
            <motion.div
                className={`relative h-full p-8 rounded-3xl backdrop-blur-sm
                           bg-gradient-to-br ${gradient}
                           border border-white/10 ${borderHover}
                           transition-colors duration-500`}
                style={{
                    transformStyle: 'preserve-3d',
                    rotateX: isHovered ? rotateX : 0,
                    rotateY: isHovered ? rotateY : 0,
                }}
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    animate={{
                        boxShadow: isHovered ? `0 20px 60px ${glowColor}` : '0 0 0 transparent',
                    }}
                    transition={{ duration: 0.4 }}
                />

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                >
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
                        }}
                        animate={{
                            x: isHovered ? ['0%', '100%'] : '0%',
                        }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                </motion.div>

                {/* Content */}
                <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
                    {/* Icon */}
                    <motion.div
                        className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm 
                                   flex items-center justify-center mb-6 text-primary-text
                                   group-hover:bg-white/20 transition-all duration-300
                                   border border-white/10 group-hover:border-white/20"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                        {icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-display font-bold text-primary-text mb-3 
                                  group-hover:text-white transition-colors duration-300">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-primary-text/60 leading-relaxed group-hover:text-primary-text/80 transition-colors duration-300">
                        {description}
                    </p>

                    {/* Learn more link */}
                    <motion.div
                        className="mt-6 flex items-center gap-2 text-sm font-medium text-primary-text/40 
                                   group-hover:text-primary-glow transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                    >
                        <span>Learn more</span>
                        <motion.svg
                            width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
                            animate={{ x: isHovered ? [0, 4, 0] : 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <path d="M3 8H13M13 8L9 4M13 8L9 12" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                    </motion.div>
                </div>

                {/* Decorative orb */}
                <motion.div
                    className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                    style={{ background: glowColor }}
                    animate={{
                        scale: isHovered ? [1, 1.3, 1] : 1,
                        opacity: isHovered ? 0.6 : 0.2,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>
        </motion.div>
    )
}

// Stats counter section
const stats = [
    { value: '10K+', label: 'Active Typers' },
    { value: '50M+', label: 'Words Typed' },
    { value: '6', label: 'Visual Modes' },
]

export default function LandingPage() {
    const router = useRouter()
    const [isHovering, setIsHovering] = useState(false)

    const handleBegin = useCallback(() => {
        router.push('/select')
    }, [router])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleBegin()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleBegin])

    return (
        <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a0a12]">
            {/* Starfield background */}
            <ParticleBackground />

            {/* Gradient overlays for depth */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(107, 95, 255, 0.1) 0%, transparent 50%)',
                    zIndex: 2,
                }}
            />
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 40%)',
                    zIndex: 2,
                }}
            />

            {/* Navigation */}
            <motion.header
                className="relative z-20 w-full px-6 md:px-12 py-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <nav className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.img
                            src="/images/logo.png"
                            alt="Typlax Logo"
                            className="w-16 h-16 rounded-xl shadow-lg shadow-primary-glow/30"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                        />
                        <span className="text-2xl font-display font-bold text-primary-text group-hover:text-white transition-colors">
                            Typlax
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { label: 'Modes', href: '/select' },
                            { label: 'Leaderboard', href: '/leaderboard' },
                            { label: 'Progress', href: '/history' },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 text-sm text-primary-text/60 hover:text-primary-text 
                                          hover:bg-white/5 rounded-lg transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/login"
                                className="ml-4 px-5 py-2.5 text-sm font-medium text-white 
                                          bg-gradient-to-r from-primary-glow to-purple-500
                                          rounded-xl shadow-lg shadow-primary-glow/25
                                          hover:shadow-primary-glow/40 transition-all"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    </div>

                    {/* Mobile menu */}
                    <button className="md:hidden p-2 text-primary-text/60 hover:text-primary-text">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </nav>
            </motion.header>

            {/* Hero Section */}
            <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full
                                   bg-primary-glow/10 border border-primary-glow/20"
                        variants={itemVariants}
                    >
                        <span className="w-2 h-2 rounded-full bg-primary-glow animate-pulse" />
                        <span className="text-sm text-primary-glow font-medium">New: Car Racing mode available</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                        variants={itemVariants}
                    >
                        <span className="text-primary-text">Type to </span>
                        <span className="bg-gradient-to-r from-primary-glow via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Transform
                        </span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        className="text-lg md:text-xl text-primary-text/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        Experience typing like never before. Watch your keystrokes transform beautiful
                        visual scenes — from growing trees to racing cars.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6" variants={itemVariants}>
                        <motion.button
                            onClick={handleBegin}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            className="relative group px-8 py-4 text-lg font-display font-semibold
                                      bg-gradient-to-r from-primary-glow to-purple-500 text-white
                                      rounded-2xl shadow-xl shadow-primary-glow/30
                                      hover:shadow-primary-glow/50 transition-all duration-300
                                      overflow-hidden"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={{ x: isHovering ? '100%' : '-100%' }}
                                transition={{ duration: 0.5 }}
                            />
                            <span className="relative flex items-center gap-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Start Typing Now
                            </span>
                        </motion.button>

                        <motion.button
                            onClick={() => router.push('/leaderboard')}
                            className="px-8 py-4 text-lg font-display font-medium text-primary-text/80
                                      border border-white/20 rounded-2xl
                                      hover:bg-white/5 hover:border-white/30 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View Leaderboard
                        </motion.button>
                    </motion.div>

                    {/* Keyboard hint */}
                    <motion.p className="text-sm text-primary-text/30" variants={itemVariants}>
                        or press <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs mx-1">Enter</kbd> to begin
                    </motion.p>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="flex flex-wrap justify-center gap-12 md:gap-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <p className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary-glow to-purple-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-primary-text/50 mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Feature Cards Section */}
            <section className="relative z-10 px-6 py-16 md:py-24">
                <div className="max-w-6xl mx-auto">
                    {/* Section header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-text mb-4">
                            How It Works
                        </h2>
                        <p className="text-primary-text/50 max-w-lg mx-auto">
                            Simple yet powerful. Type, watch, and improve your skills.
                        </p>
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.title}
                                title={feature.title}
                                description={feature.description}
                                icon={feature.icon}
                                gradient={feature.gradient}
                                glowColor={feature.glowColor}
                                borderHover={feature.borderHover}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 py-20">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="relative p-12 rounded-3xl bg-gradient-to-br from-primary-glow/10 to-purple-500/10 
                                   border border-white/10 overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-glow/30 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-text mb-4">
                                Ready to Transform Your Typing?
                            </h2>
                            <p className="text-primary-text/60 mb-8 max-w-lg mx-auto">
                                Join thousands of typists who are improving their skills while enjoying beautiful visuals.
                            </p>
                            <motion.button
                                onClick={handleBegin}
                                className="px-10 py-4 text-lg font-display font-semibold
                                          bg-white text-gray-900 rounded-2xl
                                          shadow-xl hover:shadow-2xl transition-all"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get Started Free
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <motion.footer
                className="relative z-10 px-6 py-10 border-t border-white/5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="Typlax Logo"
                                className="w-14 h-14 rounded-lg"
                            />
                            <span className="text-xl font-display font-bold text-primary-text">Typlax</span>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-6 text-sm text-primary-text/40">
                            <Link href="/select" className="hover:text-primary-text/70 transition-colors">Modes</Link>
                            <Link href="/leaderboard" className="hover:text-primary-text/70 transition-colors">Leaderboard</Link>
                            <Link href="/history" className="hover:text-primary-text/70 transition-colors">Progress</Link>
                            <Link href="/login" className="hover:text-primary-text/70 transition-colors">Login</Link>
                        </div>

                        {/* Copyright */}
                        <p className="text-sm text-primary-text/30">
                            © 2026 Typlax. All rights reserved.
                        </p>
                    </div>
                </div>
            </motion.footer>
        </main>
    )
}
