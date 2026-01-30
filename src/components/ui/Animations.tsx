'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
    children: ReactNode
}

// Page transition variants
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

// Fade In component for elements
interface FadeInProps {
    children: ReactNode
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right'
    duration?: number
    className?: string
}

export function FadeIn({
    children,
    delay = 0,
    direction = 'up',
    duration = 0.5,
    className = ''
}: FadeInProps) {
    const directions = {
        up: { y: 30, x: 0 },
        down: { y: -30, x: 0 },
        left: { y: 0, x: 30 },
        right: { y: 0, x: -30 },
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directions[direction]
            }}
            animate={{
                opacity: 1,
                x: 0,
                y: 0
            }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Stagger container for children animations
interface StaggerContainerProps {
    children: ReactNode
    staggerDelay?: number
    className?: string
}

export function StaggerContainer({
    children,
    staggerDelay = 0.1,
    className = ''
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: 0.2,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Stagger item for use inside StaggerContainer
interface StaggerItemProps {
    children: ReactNode
    className?: string
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Scale on hover effect
interface ScaleOnHoverProps {
    children: ReactNode
    scale?: number
    className?: string
}

export function ScaleOnHover({
    children,
    scale = 1.05,
    className = ''
}: ScaleOnHoverProps) {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Floating animation
interface FloatingProps {
    children: ReactNode
    duration?: number
    distance?: number
    className?: string
}

export function Floating({
    children,
    duration = 3,
    distance = 10,
    className = ''
}: FloatingProps) {
    return (
        <motion.div
            animate={{
                y: [-distance / 2, distance / 2, -distance / 2],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Glow pulse effect
interface GlowPulseProps {
    children: ReactNode
    color?: string
    className?: string
}

export function GlowPulse({
    children,
    color = 'rgba(107, 95, 255, 0.5)',
    className = ''
}: GlowPulseProps) {
    return (
        <motion.div
            animate={{
                boxShadow: [
                    `0 0 20px ${color}`,
                    `0 0 40px ${color}`,
                    `0 0 20px ${color}`,
                ],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Magnetic effect (follows cursor slightly)
interface MagneticProps {
    children: ReactNode
    strength?: number
    className?: string
}

export function Magnetic({ children, strength = 0.3, className = '' }: MagneticProps) {
    return (
        <motion.div
            whileHover={{
                scale: 1.02,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Text reveal animation
interface TextRevealProps {
    text: string
    delay?: number
    className?: string
}

export function TextReveal({ text, delay = 0, className = '' }: TextRevealProps) {
    const words = text.split(' ')

    return (
        <motion.span className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: delay + i * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    )
}

// Blur fade in effect
interface BlurFadeInProps {
    children: ReactNode
    delay?: number
    className?: string
}

export function BlurFadeIn({ children, delay = 0, className = '' }: BlurFadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Slide in from edge
interface SlideInProps {
    children: ReactNode
    from?: 'left' | 'right' | 'top' | 'bottom'
    delay?: number
    className?: string
}

export function SlideIn({
    children,
    from = 'left',
    delay = 0,
    className = ''
}: SlideInProps) {
    const directions = {
        left: { x: -100, y: 0 },
        right: { x: 100, y: 0 },
        top: { x: 0, y: -100 },
        bottom: { x: 0, y: 100 },
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directions[from]
            }}
            animate={{
                opacity: 1,
                x: 0,
                y: 0
            }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
