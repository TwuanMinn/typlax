'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
}

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                await authApi.login(email, password)
            } else {
                await authApi.signup(email, password, username)
            }
            router.push('/select')
        } catch (err: any) {
            setError(err.message || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Animated background orbs */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full bg-primary-glow/10 blur-[100px] -top-40 -left-40"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[80px] bottom-20 right-20"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -50, 0],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="relative z-10 w-full max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Back link */}
                <motion.div variants={itemVariants}>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-8 text-primary-text/50 hover:text-primary-text transition-all duration-300 group"
                    >
                        <motion.span
                            animate={{ x: [0, -3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            ←
                        </motion.span>
                        <span className="group-hover:translate-x-1 transition-transform">Back to Home</span>
                    </Link>
                </motion.div>

                {/* Card */}
                <motion.div
                    className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ borderColor: 'rgba(107, 95, 255, 0.3)' }}
                >
                    {/* Card glow effect */}
                    <motion.div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        animate={{
                            boxShadow: focusedField
                                ? '0 0 60px rgba(107, 95, 255, 0.15)'
                                : '0 0 30px rgba(107, 95, 255, 0.05)',
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Logo */}
                    <motion.div
                        className="text-center mb-8"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-glow/20 mb-4"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-glow">
                                <rect x="2" y="6" width="20" height="12" rx="2" />
                                <line x1="6" y1="10" x2="6" y2="10.01" />
                                <line x1="10" y1="10" x2="10" y2="10.01" />
                                <line x1="14" y1="10" x2="14" y2="10.01" />
                                <line x1="18" y1="10" x2="18" y2="10.01" />
                                <line x1="8" y1="14" x2="16" y2="14" />
                            </svg>
                        </motion.div>
                        <h1 className="font-display text-3xl font-bold text-primary-text mb-2">
                            Typlax
                        </h1>
                        <motion.p
                            className="text-primary-text/60"
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {isLogin ? 'Welcome back!' : 'Create your account'}
                        </motion.p>
                    </motion.div>

                    {/* Toggle */}
                    <motion.div
                        className="relative flex mb-6 bg-white/5 rounded-xl p-1"
                        variants={itemVariants}
                    >
                        {/* Sliding background */}
                        <motion.div
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary-glow rounded-lg"
                            animate={{ x: isLogin ? 0 : '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />

                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`relative flex-1 py-2.5 rounded-lg font-medium transition-colors z-10 ${isLogin ? 'text-white' : 'text-primary-text/60 hover:text-primary-text'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`relative flex-1 py-2.5 rounded-lg font-medium transition-colors z-10 ${!isLogin ? 'text-white' : 'text-primary-text/60 hover:text-primary-text'
                                }`}
                        >
                            Sign Up
                        </button>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label htmlFor="username" className="block text-sm text-primary-text/70 mb-2">
                                        Username
                                    </label>
                                    <motion.div
                                        className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'username'
                                                ? 'border-primary-glow shadow-[0_0_20px_rgba(107,95,255,0.2)]'
                                                : 'border-white/10'
                                            }`}
                                    >
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            onFocus={() => setFocusedField('username')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full px-4 py-3 bg-transparent rounded-xl
                                                       text-primary-text placeholder-primary-text/30
                                                       focus:outline-none"
                                            placeholder="Your username"
                                            required={!isLogin}
                                        />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div variants={itemVariants}>
                            <label htmlFor="email" className="block text-sm text-primary-text/70 mb-2">
                                Email
                            </label>
                            <motion.div
                                className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'email'
                                        ? 'border-primary-glow shadow-[0_0_20px_rgba(107,95,255,0.2)]'
                                        : 'border-white/10'
                                    }`}
                            >
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full px-4 py-3 bg-transparent rounded-xl
                                               text-primary-text placeholder-primary-text/30
                                               focus:outline-none"
                                    placeholder="you@example.com"
                                    required
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label htmlFor="password" className="block text-sm text-primary-text/70 mb-2">
                                Password
                            </label>
                            <motion.div
                                className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'password'
                                        ? 'border-primary-glow shadow-[0_0_20px_rgba(107,95,255,0.2)]'
                                        : 'border-white/10'
                                    }`}
                            >
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full px-4 py-3 bg-transparent rounded-xl
                                               text-primary-text placeholder-primary-text/30
                                               focus:outline-none"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span className="text-sm text-red-400">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="relative w-full py-3.5 bg-gradient-to-r from-primary-glow to-purple-500 
                                       text-white font-display font-semibold rounded-xl
                                       overflow-hidden group
                                       disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(107, 95, 255, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            variants={itemVariants}
                        >
                            {/* Shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.5 }}
                            />

                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                        <span>Please wait...</span>
                                    </>
                                ) : (
                                    isLogin ? 'Login' : 'Create Account'
                                )}
                            </span>
                        </motion.button>
                    </form>

                    {/* Continue as guest */}
                    <motion.div
                        className="mt-6 text-center"
                        variants={itemVariants}
                    >
                        <Link
                            href="/select"
                            className="inline-flex items-center gap-2 text-sm text-primary-text/50 hover:text-primary-glow transition-colors group"
                        >
                            <span>Continue as guest</span>
                            <motion.span
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="group-hover:text-primary-glow"
                            >
                                →
                            </motion.span>
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </main>
    )
}
