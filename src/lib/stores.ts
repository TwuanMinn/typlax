import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ModeId, SessionResult } from '@/types'

interface GameState {
    // Current game state
    currentMode: ModeId | null
    isPlaying: boolean
    text: string
    typedChars: string[]
    currentPosition: number
    errors: number[]
    startTime: number | null

    // Metrics (updated in real-time)
    currentWPM: number
    accuracy: number
    progress: number

    // User preferences
    preferences: {
        showKeyboard: boolean
        soundEnabled: boolean
        volume: number
        textSize: 'small' | 'medium' | 'large'
        highContrast: boolean
    }

    // Session history
    recentResults: SessionResult[]

    // Actions
    setMode: (mode: ModeId) => void
    startGame: (text: string) => void
    typeChar: (char: string, isCorrect: boolean) => void
    updateMetrics: (wpm: number, accuracy: number, progress: number) => void
    endGame: (result: SessionResult) => void
    resetGame: () => void
    setPreference: <K extends keyof GameState['preferences']>(
        key: K,
        value: GameState['preferences'][K]
    ) => void
    setPreferences: (prefs: Partial<GameState['preferences']>) => void
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            // Initial state
            currentMode: null,
            isPlaying: false,
            text: '',
            typedChars: [],
            currentPosition: 0,
            errors: [],
            startTime: null,
            currentWPM: 0,
            accuracy: 100,
            progress: 0,
            preferences: {
                showKeyboard: true,
                soundEnabled: true,
                volume: 0.7,
                textSize: 'medium',
                highContrast: false,
            },
            recentResults: [],

            // Actions
            setMode: (mode) => set({ currentMode: mode }),

            startGame: (text) => set({
                isPlaying: true,
                text,
                typedChars: [],
                currentPosition: 0,
                errors: [],
                startTime: Date.now(),
                currentWPM: 0,
                accuracy: 100,
                progress: 0,
            }),

            typeChar: (char, isCorrect) => set((state) => ({
                typedChars: [...state.typedChars, char],
                currentPosition: state.currentPosition + 1,
                errors: isCorrect ? state.errors : [...state.errors, state.currentPosition],
            })),

            updateMetrics: (wpm, accuracy, progress) => set({
                currentWPM: wpm,
                accuracy,
                progress,
            }),

            endGame: (result) => set((state) => ({
                isPlaying: false,
                recentResults: [result, ...state.recentResults].slice(0, 10),
            })),

            resetGame: () => set({
                isPlaying: false,
                text: '',
                typedChars: [],
                currentPosition: 0,
                errors: [],
                startTime: null,
                currentWPM: 0,
                accuracy: 100,
                progress: 0,
            }),

            setPreference: (key, value) => set((state) => ({
                preferences: { ...state.preferences, [key]: value },
            })),

            setPreferences: (prefs) => set((state) => ({
                preferences: { ...state.preferences, ...prefs },
            })),
        }),
        {
            name: 'typlax-storage',
            partialize: (state) => ({
                preferences: state.preferences,
                recentResults: state.recentResults,
            }),
        }
    )
)
