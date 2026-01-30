'use client'

/**
 * SoundController - Web Audio API integration for Typlax
 * Handles keystroke sounds, ambient tracks, and milestone chimes
 */
export class SoundController {
    private audioContext: AudioContext | null = null
    private gainNode: GainNode | null = null
    private volume: number = 0.7
    private enabled: boolean = true
    private initialized: boolean = false

    constructor() {
        // AudioContext is created on first user interaction
    }

    private async init() {
        if (this.initialized) return

        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            this.gainNode = this.audioContext.createGain()
            this.gainNode.connect(this.audioContext.destination)
            this.gainNode.gain.value = this.volume
            this.initialized = true
        } catch (e) {
            console.warn('Web Audio API not supported')
        }
    }

    /**
     * Play a keystroke sound
     */
    async playKeystroke(isCorrect: boolean, wpm: number = 60) {
        if (!this.enabled) return
        await this.init()
        if (!this.audioContext || !this.gainNode) return

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.gainNode)

        if (isCorrect) {
            // Pleasant clicking sound - higher pitched, short
            oscillator.type = 'sine'
            // Vary pitch slightly based on WPM for more dynamic feel
            const baseFreq = 800 + (wpm * 2)
            oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.05)

            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08)

            oscillator.start(this.audioContext.currentTime)
            oscillator.stop(this.audioContext.currentTime + 0.08)
        } else {
            // Error sound - lower, discordant
            oscillator.type = 'sawtooth'
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.15)

            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15)

            oscillator.start(this.audioContext.currentTime)
            oscillator.stop(this.audioContext.currentTime + 0.15)
        }
    }

    /**
     * Play milestone chime at 25%, 50%, 75%
     */
    async playMilestone(percent: number) {
        if (!this.enabled) return
        await this.init()
        if (!this.audioContext || !this.gainNode) return

        // Create a pleasant chord based on milestone
        const notes = {
            25: [523.25, 659.25, 783.99], // C5, E5, G5
            50: [587.33, 739.99, 880.00], // D5, F#5, A5
            75: [659.25, 830.61, 987.77], // E5, G#5, B5
            100: [783.99, 987.77, 1174.66, 1318.51], // G5, B5, D6, E6
        }

        const frequencies = notes[percent as keyof typeof notes] || notes[25]

        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext!.createOscillator()
            const gainNode = this.audioContext!.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.gainNode!)

            oscillator.type = 'sine'
            oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime)

            const startTime = this.audioContext!.currentTime + (i * 0.05)
            gainNode.gain.setValueAtTime(0, startTime)
            gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.1)
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5)

            oscillator.start(startTime)
            oscillator.stop(startTime + 0.5)
        })
    }

    /**
     * Play completion sound
     */
    async playComplete() {
        if (!this.enabled) return
        await this.playMilestone(100)
    }

    /**
     * Create ambient drone based on mode and progress
     */
    private ambientOscillator: OscillatorNode | null = null
    private ambientGain: GainNode | null = null

    async startAmbient(modeId: string) {
        if (!this.enabled) return
        await this.init()
        if (!this.audioContext || !this.gainNode) return

        // Stop existing ambient
        this.stopAmbient()

        // Mode-specific ambient frequencies (drone notes)
        const modeFrequencies: Record<string, number[]> = {
            'tree-growing': [65.41, 130.81], // C2, C3 - earthy
            'egg-to-bird': [98.00, 196.00], // G2, G3 - airy
            'broken-glass': [73.42, 146.83], // D2, D3 - mysterious
            'night-sunrise': [55.00, 110.00], // A1, A2 - warm
            'tv-static': [82.41, 164.81], // E2, E3 - electronic
            'car-racing': [87.31, 174.61], // F2, F3 - energetic
        }

        const freqs = modeFrequencies[modeId] || [65.41, 130.81]

        // Create soft ambient drone
        this.ambientOscillator = this.audioContext.createOscillator()
        this.ambientGain = this.audioContext.createGain()

        this.ambientOscillator.type = 'sine'
        this.ambientOscillator.frequency.setValueAtTime(freqs[0], this.audioContext.currentTime)

        this.ambientGain.gain.setValueAtTime(0, this.audioContext.currentTime)
        this.ambientGain.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 2)

        this.ambientOscillator.connect(this.ambientGain)
        this.ambientGain.connect(this.gainNode)
        this.ambientOscillator.start()
    }

    updateAmbient(progress: number) {
        if (!this.ambientGain || !this.audioContext) return

        // Increase ambient intensity with progress
        const targetGain = 0.02 + (progress / 100) * 0.04
        this.ambientGain.gain.linearRampToValueAtTime(targetGain, this.audioContext.currentTime + 0.1)
    }

    stopAmbient() {
        if (this.ambientOscillator) {
            try {
                this.ambientOscillator.stop()
            } catch (e) {
                // Already stopped
            }
            this.ambientOscillator = null
        }
        this.ambientGain = null
    }

    setVolume(level: number) {
        this.volume = Math.max(0, Math.min(1, level))
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume
        }
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled
        if (!enabled) {
            this.stopAmbient()
        }
    }

    mute() {
        this.setEnabled(false)
    }

    unmute() {
        this.setEnabled(true)
    }
}

// Singleton instance
let soundControllerInstance: SoundController | null = null

export function getSoundController(): SoundController {
    if (!soundControllerInstance) {
        soundControllerInstance = new SoundController()
    }
    return soundControllerInstance
}
