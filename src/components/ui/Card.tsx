'use client'

import { cn } from '@/lib/utils'
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion'
import { forwardRef, useRef } from 'react'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
    variant?: 'default' | 'glass' | 'gradient' | 'glow'
    hoverEffect?: 'lift' | 'tilt' | 'glow' | 'none'
    glowColor?: string
    children?: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hoverEffect = 'lift', glowColor, children, ...props }, ref) => {
        const cardRef = useRef<HTMLDivElement>(null)

        // Mouse position for tilt effect
        const mouseX = useMotionValue(0)
        const mouseY = useMotionValue(0)

        // Spring physics for smooth movement
        const springConfig = { stiffness: 300, damping: 30 }
        const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig)
        const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig)

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (hoverEffect !== 'tilt' || !cardRef.current) return

            const rect = cardRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            mouseX.set((e.clientX - centerX) / rect.width)
            mouseY.set((e.clientY - centerY) / rect.height)
        }

        const handleMouseLeave = () => {
            mouseX.set(0)
            mouseY.set(0)
        }

        const variantStyles = {
            default: 'bg-neutral-900/50 border-neutral-800',
            glass: 'bg-white/5 border-white/10 backdrop-blur-xl',
            gradient: 'bg-gradient-to-br from-white/10 to-white/5 border-white/10',
            glow: 'bg-white/5 border-primary-glow/30',
        }

        const hoverStyles = {
            lift: { y: -8, transition: { type: 'spring', stiffness: 400, damping: 17 } },
            tilt: {},
            glow: { boxShadow: `0 0 40px ${glowColor || 'rgba(107, 95, 255, 0.4)'}` },
            none: {},
        }

        if (hoverEffect === 'tilt') {
            return (
                <motion.div
                    ref={cardRef}
                    className={cn(
                        'rounded-xl border p-6 backdrop-blur-sm',
                        variantStyles[variant],
                        className
                    )}
                    style={{
                        perspective: 1000,
                        transformStyle: 'preserve-3d',
                        rotateX,
                        rotateY,
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    {...props}
                >
                    <motion.div
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {children}
                    </motion.div>

                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                            opacity: useTransform(mouseX, [-0.5, 0, 0.5], [0, 0.5, 0]),
                        }}
                    />
                </motion.div>
            )
        }

        return (
            <motion.div
                ref={ref}
                className={cn(
                    'rounded-xl border p-6 backdrop-blur-sm transition-all duration-300',
                    variantStyles[variant],
                    hoverEffect !== 'none' && 'hover:border-white/20',
                    className
                )}
                whileHover={hoverStyles[hoverEffect]}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)

Card.displayName = 'Card'

// Glass Card variant with gradient border
interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
    gradientFrom?: string
    gradientTo?: string
    children?: React.ReactNode
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, gradientFrom = '#6b5fff', gradientTo = '#a855f7', children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    'relative rounded-xl overflow-hidden',
                    className
                )}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                {...props}
            >
                {/* Gradient border */}
                <div
                    className="absolute inset-0 rounded-xl p-[1px]"
                    style={{
                        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                        opacity: 0.5,
                    }}
                />

                {/* Inner content */}
                <div className="relative bg-neutral-900/80 backdrop-blur-xl rounded-xl p-6 m-[1px]">
                    {children}
                </div>
            </motion.div>
        )
    }
)

GlassCard.displayName = 'GlassCard'

// Hover reveal card
interface HoverRevealCardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
    revealContent?: React.ReactNode
    children?: React.ReactNode
}

export const HoverRevealCard = forwardRef<HTMLDivElement, HoverRevealCardProps>(
    ({ className, children, revealContent, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    'relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group',
                    className
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                {...props}
            >
                {/* Main content */}
                <div className="p-6 transition-opacity duration-300 group-hover:opacity-80">
                    {children}
                </div>

                {/* Reveal content on hover */}
                {revealContent && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent 
                                   flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        {revealContent}
                    </motion.div>
                )}
            </motion.div>
        )
    }
)

HoverRevealCard.displayName = 'HoverRevealCard'
