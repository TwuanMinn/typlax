'use client'

import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef, useState } from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'gradient' | 'outline' | 'glow'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        ...props
    }, ref) => {
        const [isHovering, setIsHovering] = useState(false)

        const variantStyles = {
            primary: 'bg-primary-glow text-white hover:bg-primary-glow/90 shadow-lg shadow-primary-glow/25',
            secondary: 'bg-white/10 text-primary-text hover:bg-white/20 border border-white/10',
            ghost: 'text-primary-text/70 hover:text-primary-text hover:bg-white/10',
            gradient: 'bg-gradient-to-r from-primary-glow to-purple-500 text-white shadow-lg shadow-primary-glow/30',
            outline: 'border border-white/20 text-primary-text hover:border-primary-glow/50 hover:bg-white/5',
            glow: 'bg-primary-glow text-white',
        }

        const sizeStyles = {
            sm: 'h-8 px-3 text-sm gap-1.5',
            md: 'h-10 px-4 text-sm gap-2',
            lg: 'h-12 px-6 text-base gap-2.5',
        }

        return (
            <motion.button
                ref={ref}
                className={cn(
                    'relative inline-flex items-center justify-center rounded-lg font-medium',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-bg',
                    'disabled:pointer-events-none disabled:opacity-50',
                    'overflow-hidden transition-colors duration-200',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                disabled={disabled || isLoading}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                {...props}
            >
                {/* Glow effect for glow variant */}
                {variant === 'glow' && (
                    <motion.div
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        animate={{
                            boxShadow: isHovering
                                ? '0 0 30px rgba(107, 95, 255, 0.6), 0 0 60px rgba(107, 95, 255, 0.4)'
                                : '0 0 20px rgba(107, 95, 255, 0.3)',
                        }}
                        transition={{ duration: 0.3 }}
                    />
                )}

                {/* Shine effect on hover */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                    }}
                    initial={{ x: '-100%' }}
                    animate={{ x: isHovering ? '100%' : '-100%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />

                {/* Loading spinner */}
                {isLoading && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                    </motion.div>
                )}

                {/* Content */}
                <span className={cn(
                    'relative z-10 flex items-center gap-2',
                    isLoading && 'opacity-0'
                )}>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </span>
            </motion.button>
        )
    }
)

Button.displayName = 'Button'

// Icon button variant
interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    variant?: 'default' | 'ghost' | 'glow'
    size?: 'sm' | 'md' | 'lg'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const sizeStyles = {
            sm: 'w-8 h-8',
            md: 'w-10 h-10',
            lg: 'w-12 h-12',
        }

        const variantStyles = {
            default: 'bg-white/10 text-primary-text hover:bg-white/20 border border-white/10',
            ghost: 'text-primary-text/60 hover:text-primary-text hover:bg-white/10',
            glow: 'bg-primary-glow/20 text-primary-glow hover:bg-primary-glow/30',
        }

        return (
            <motion.button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow/50',
                    'transition-colors duration-200',
                    sizeStyles[size],
                    variantStyles[variant],
                    className
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                {...props}
            >
                {children}
            </motion.button>
        )
    }
)

IconButton.displayName = 'IconButton'

// Animated link button
interface LinkButtonProps extends Omit<HTMLMotionProps<'a'>, 'ref'> {
    external?: boolean
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
    ({ className, children, external = false, ...props }, ref) => {
        return (
            <motion.a
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-2 text-primary-text/60 hover:text-primary-text',
                    'transition-colors duration-200 group',
                    className
                )}
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                {...props}
            >
                {children}
                <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                >
                    →
                </motion.span>
            </motion.a>
        )
    }
)

LinkButton.displayName = 'LinkButton'
