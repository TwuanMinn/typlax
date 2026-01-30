// Mode Types

export type ModeId = 'tree-growing' | 'egg-to-bird' | 'broken-glass' | 'night-sunrise' | 'tv-static' | 'car-racing'

export type Difficulty = 'beginner' | 'medium' | 'hard'

export interface Mode {
    id: ModeId
    name: string
    description: string
    icon: string
    image: string
    difficulty: Difficulty
    startingState: string
    transformation: string
    colors: {
        primary: string
        secondary: string
        accent: string
    }
}

// Typing Types

export interface TypingMetrics {
    currentWPM: number
    rawWPM: number
    accuracy: number
    progress: number
    correctChars: number
    incorrectChars: number
    totalChars: number
    startTime: number | null
    elapsedTime: number
}

export interface TypingState {
    text: string
    typedText: string
    currentPosition: number
    isActive: boolean
    isComplete: boolean
    errors: number[]
}

export interface KeyState {
    key: string
    state: 'idle' | 'expected' | 'correct' | 'incorrect'
}

// Results Types

export interface SessionResult {
    mode: ModeId
    finalWPM: number
    accuracy: number
    timeSeconds: number
    characterCount: number
    errorCount: number
    fastestBurst: number
    consistency: number
    timestamp: number
}

// Sound Types

export type SoundType = 'keystroke-correct' | 'keystroke-error' | 'milestone' | 'complete' | 'ambient'

export interface SoundConfig {
    enabled: boolean
    volume: number
}

// Store Types

export interface AppState {
    currentMode: ModeId | null
    isPlaying: boolean
    metrics: TypingMetrics
    preferences: {
        showKeyboard: boolean
        soundEnabled: boolean
        volume: number
    }
}
