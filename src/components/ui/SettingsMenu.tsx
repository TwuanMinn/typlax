'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useGameStore } from '@/lib/stores'
import { getSoundController } from '@/lib/sound-controller'

interface SettingsMenuProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
    const { preferences, setPreferences } = useGameStore()
    const [volume, setVolume] = useState(preferences.volume)

    const handleSoundToggle = () => {
        const newEnabled = !preferences.soundEnabled
        setPreferences({ soundEnabled: newEnabled })

        if (newEnabled) {
            getSoundController().unmute()
        } else {
            getSoundController().mute()
        }
    }

    const handleKeyboardToggle = () => {
        setPreferences({ showKeyboard: !preferences.showKeyboard })
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)
        setPreferences({ volume: newVolume })
        getSoundController().setVolume(newVolume)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Settings Panel */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                                   w-full max-w-md bg-primary-bg border border-white/10 rounded-2xl
                                   shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h2 className="font-display text-xl font-semibold">Settings</h2>
                            <button
                                onClick={onClose}
                                className="text-primary-text/50 hover:text-primary-text transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Settings Options */}
                        <div className="p-6 space-y-6">
                            {/* Sound Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">Sound Effects</h3>
                                    <p className="text-sm text-primary-text/60">
                                        Keystroke sounds and chimes
                                    </p>
                                </div>
                                <button
                                    onClick={handleSoundToggle}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${preferences.soundEnabled
                                        ? 'bg-accent-success'
                                        : 'bg-white/20'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.soundEnabled
                                            ? 'translate-x-7'
                                            : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Volume Slider */}
                            {preferences.soundEnabled && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <h3 className="font-medium mb-2">Volume</h3>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer
                                                   [&::-webkit-slider-thumb]:appearance-none
                                                   [&::-webkit-slider-thumb]:w-4
                                                   [&::-webkit-slider-thumb]:h-4
                                                   [&::-webkit-slider-thumb]:rounded-full
                                                   [&::-webkit-slider-thumb]:bg-primary-glow"
                                    />
                                    <div className="flex justify-between text-xs text-primary-text/50 mt-1">
                                        <span>0%</span>
                                        <span>{Math.round(volume * 100)}%</span>
                                        <span>100%</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Keyboard Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">On-Screen Keyboard</h3>
                                    <p className="text-sm text-primary-text/60">
                                        Show virtual keyboard during typing
                                    </p>
                                </div>
                                <button
                                    onClick={handleKeyboardToggle}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${preferences.showKeyboard
                                        ? 'bg-accent-success'
                                        : 'bg-white/20'
                                        }`}
                                    aria-label="Toggle on-screen keyboard"
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.showKeyboard
                                            ? 'translate-x-7'
                                            : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-white/10 my-4" />
                            <h3 className="text-sm font-medium text-primary-text/50 uppercase tracking-wide">
                                Accessibility
                            </h3>

                            {/* Text Size */}
                            <div>
                                <h3 className="font-medium mb-3">Text Size</h3>
                                <div className="flex gap-2">
                                    {(['small', 'medium', 'large'] as const).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setPreferences({ textSize: size })}
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${preferences.textSize === size
                                                    ? 'bg-primary-glow text-white'
                                                    : 'bg-white/10 text-primary-text/60 hover:bg-white/20'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* High Contrast */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">High Contrast</h3>
                                    <p className="text-sm text-primary-text/60">
                                        Increase color contrast for visibility
                                    </p>
                                </div>
                                <button
                                    onClick={() => setPreferences({ highContrast: !preferences.highContrast })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${preferences.highContrast
                                        ? 'bg-accent-success'
                                        : 'bg-white/20'
                                        }`}
                                    aria-label="Toggle high contrast mode"
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.highContrast
                                            ? 'translate-x-7'
                                            : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                            <button
                                onClick={onClose}
                                className="w-full py-2 bg-primary-glow text-white font-medium rounded-lg
                                           hover:opacity-90 transition-opacity"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
