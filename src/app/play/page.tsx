'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { VirtualKeyboard } from '@/components/keyboard/VirtualKeyboard'
import { TextDisplay } from '@/components/typing/TextDisplay'
import { StatsHUD } from '@/components/typing/StatsHUD'
import { SettingsMenu } from '@/components/ui/SettingsMenu'
import { InputHandler } from '@/lib/input-handler'
import { MetricsCalculator } from '@/lib/metrics'
import { getSoundController } from '@/lib/sound-controller'
import { useGameStore } from '@/lib/stores'
import { getModeById, getRandomText } from '@/data/modes'
import { ModeId } from '@/types'

// Import all mode visualizers
import { TreeGrowingMode } from '@/modes/tree-growing'
import { NightSunriseMode } from '@/modes/night-sunrise'
import { TVStaticMode } from '@/modes/tv-static'
import { EggToBirdMode } from '@/modes/egg-to-bird'
import { BrokenGlassMode } from '@/modes/broken-glass'
import { CarRacingMode } from '@/modes/car-racing'

function PlayPageLoading() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-primary-bg">
            <motion.div
                className="w-8 h-8 border-2 border-primary-glow/30 border-t-primary-glow rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </main>
    )
}

function PlayPageContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const modeId = searchParams.get('mode') as ModeId
    const mode = getModeById(modeId)

    const { preferences } = useGameStore()

    // State
    const [text] = useState(() => getRandomText())
    const [currentPosition, setCurrentPosition] = useState(0)
    const [errors, setErrors] = useState<number[]>([])
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [lastPressedKey, setLastPressedKey] = useState<string | null>(null)
    const [lastKeyCorrect, setLastKeyCorrect] = useState(true)
    const [isStarted, setIsStarted] = useState(false)
    const [recentError, setRecentError] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    // Refs
    const inputHandlerRef = useRef<InputHandler | null>(null)
    const metricsRef = useRef<MetricsCalculator>(new MetricsCalculator())
    const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const lastMilestoneRef = useRef<number>(0)

    // Handle completion
    const handleComplete = useCallback(() => {
        setIsComplete(true)
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current)
        }

        // Play completion sound
        if (preferences.soundEnabled) {
            getSoundController().playComplete()
        }

        const stats = metricsRef.current.getStats()
        router.push(
            `/results?mode=${modeId}&wpm=${stats.wpm}&accuracy=${stats.accuracy}&time=${Math.round(stats.elapsedTime)}&errors=${stats.errorCount}`
        )
    }, [modeId, router, preferences.soundEnabled])

    // Initialize input handler
    useEffect(() => {
        const onCharTyped = (char: string, isCorrect: boolean, position: number) => {
            setCurrentPosition(position + 1)
            setLastPressedKey(char)
            setLastKeyCorrect(isCorrect)

            if (!isCorrect) {
                setErrors(prev => [...prev, position])
                // Trigger shake effect
                setRecentError(true)
                setTimeout(() => setRecentError(false), 300)
            }

            metricsRef.current.recordKeystroke(char, isCorrect)

            // Play keystroke sound
            if (preferences.soundEnabled) {
                getSoundController().playKeystroke(isCorrect, wpm)
            }

            // Clear last pressed key after animation
            setTimeout(() => setLastPressedKey(null), 150)
        }

        inputHandlerRef.current = new InputHandler(text, onCharTyped, handleComplete)

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current)
            }
        }
    }, [text, handleComplete, preferences.soundEnabled, wpm])

    // Start metrics update interval
    useEffect(() => {
        if (isStarted && !isComplete) {
            updateIntervalRef.current = setInterval(() => {
                const stats = metricsRef.current.getStats()
                setWpm(stats.wpm)
                setAccuracy(stats.accuracy)
            }, 500)
        }

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current)
            }
        }
    }, [isStarted, isComplete])

    // Update progress and play milestone sounds
    useEffect(() => {
        const newProgress = (currentPosition / text.length) * 100
        setProgress(newProgress)

        // Check for milestones and play sounds
        if (preferences.soundEnabled) {
            const milestones = [25, 50, 75]
            for (const milestone of milestones) {
                if (newProgress >= milestone && lastMilestoneRef.current < milestone) {
                    getSoundController().playMilestone(milestone)
                    lastMilestoneRef.current = milestone
                    break
                }
            }
        }
    }, [currentPosition, text.length, preferences.soundEnabled])

    // Keyboard event handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape key to exit session
            if (e.key === 'Escape') {
                e.preventDefault()
                router.push('/select')
                return
            }

            if (!inputHandlerRef.current) return

            // Start on first keypress
            if (!isStarted && e.key.length === 1) {
                setIsStarted(true)
            }

            // Prevent default for certain keys
            if (['Tab', 'Enter'].includes(e.key)) {
                e.preventDefault()
            }

            inputHandlerRef.current.handleKeyPress(e)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isStarted])

    // Get the expected next character
    const expectedChar = text[currentPosition] || null

    // Render mode-specific background
    const renderModeBackground = () => {
        switch (modeId) {
            case 'tree-growing':
                return <TreeGrowingMode progress={progress} wpm={wpm} accuracy={accuracy} />
            case 'night-sunrise':
                return <NightSunriseMode progress={progress} wpm={wpm} accuracy={accuracy} />
            case 'tv-static':
                return <TVStaticMode progress={progress} wpm={wpm} accuracy={accuracy} />
            case 'egg-to-bird':
                return <EggToBirdMode progress={progress} wpm={wpm} accuracy={accuracy} />
            case 'broken-glass':
                return <BrokenGlassMode progress={progress} wpm={wpm} accuracy={accuracy} />
            case 'car-racing':
                return <CarRacingMode progress={progress} wpm={wpm} accuracy={accuracy} />
            default:
                return (
                    <div
                        className="absolute inset-0"
                        style={{
                            background: mode ? `linear-gradient(135deg, ${mode.colors.primary} 0%, ${mode.colors.secondary} 100%)` : 'linear-gradient(135deg, #1a1a3e 0%, #0f0f1e 100%)',
                        }}
                    />
                )
        }
    }

    if (!mode) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-primary-bg">
                <div className="text-center">
                    <h1 className="text-2xl font-display mb-4">Mode not found</h1>
                    <Link href="/select" className="text-primary-glow hover:underline">
                        ← Back to selection
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className={`relative min-h-screen overflow-hidden ${preferences.highContrast ? 'high-contrast' : ''}`}>
            {/* Mode-specific background */}
            {renderModeBackground()}

            {/* Content overlay */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
                {/* Back button */}
                <Link
                    href="/select"
                    className="fixed top-6 left-6 text-primary-text/50 hover:text-primary-text transition-colors z-20"
                >
                    ← Back
                </Link>

                {/* Settings button */}
                <button
                    onClick={() => setShowSettings(true)}
                    className="fixed top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 
                               flex items-center justify-center transition-colors z-20"
                    title="Settings"
                >
                    ⚙
                </button>

                {/* Settings Menu */}
                <SettingsMenu isOpen={showSettings} onClose={() => setShowSettings(false)} />

                {/* Mode title */}
                <motion.h1
                    className="font-display text-2xl font-semibold text-white/80 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {mode.name}
                </motion.h1>

                {/* Start prompt */}
                {!isStarted && (
                    <motion.p
                        className="text-white/60 mb-4 font-body"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Start typing to begin...
                    </motion.p>
                )}

                {/* Text display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <TextDisplay
                        text={text}
                        currentPosition={currentPosition}
                        errors={errors}
                        recentError={recentError}
                        textSize={preferences.textSize}
                    />
                </motion.div>

                {/* Virtual keyboard */}
                <div className="mt-12">
                    <VirtualKeyboard
                        expectedKey={expectedChar}
                        lastPressedKey={lastPressedKey}
                        lastKeyCorrect={lastKeyCorrect}
                        visible={preferences.showKeyboard}
                    />
                </div>
            </div>

            {/* Stats HUD */}
            <StatsHUD
                progress={progress}
                wpm={wpm}
                accuracy={accuracy}
            />
        </main>
    )
}

export default function PlayPage() {
    return (
        <Suspense fallback={<PlayPageLoading />}>
            <PlayPageContent />
        </Suspense>
    )
}
