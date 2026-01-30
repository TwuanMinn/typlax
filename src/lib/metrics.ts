import { calculateWPM, calculateAccuracy } from './utils'

interface Keystroke {
    char: string
    isCorrect: boolean
    timestamp: number
}

/**
 * MetricsCalculator - Calculates WPM, accuracy, and other typing metrics
 * Per PRD: WPM smoothed over 3-second rolling window
 */
export class MetricsCalculator {
    private keystrokes: Keystroke[] = []
    private startTime: number | null = null
    private correctChars = 0
    private totalChars = 0

    // Rolling window for WPM smoothing (3 seconds)
    private readonly ROLLING_WINDOW_MS = 3000

    recordKeystroke(char: string, isCorrect: boolean): void {
        const timestamp = Date.now()

        // Start timer on first keystroke
        if (this.startTime === null) {
            this.startTime = timestamp
        }

        this.keystrokes.push({ char, isCorrect, timestamp })
        this.totalChars++

        if (isCorrect) {
            this.correctChars++
        }
    }

    /**
     * Get current WPM using rolling window for smoothing
     */
    getCurrentWPM(): number {
        if (this.startTime === null || this.keystrokes.length === 0) return 0

        const now = Date.now()
        const windowStart = now - this.ROLLING_WINDOW_MS

        // Count correct characters in the rolling window
        const recentCorrect = this.keystrokes.filter(
            k => k.timestamp >= windowStart && k.isCorrect
        ).length

        // Calculate WPM for the window
        const windowSeconds = Math.min(
            (now - this.startTime) / 1000,
            this.ROLLING_WINDOW_MS / 1000
        )

        if (windowSeconds <= 0) return 0

        return calculateWPM(recentCorrect, windowSeconds)
    }

    /**
     * Get raw WPM (not smoothed, overall average)
     */
    getRawWPM(): number {
        if (this.startTime === null) return 0
        const elapsed = (Date.now() - this.startTime) / 1000
        return calculateWPM(this.correctChars, elapsed)
    }

    /**
     * Get accuracy percentage
     */
    getAccuracy(): number {
        return calculateAccuracy(this.correctChars, this.totalChars)
    }

    /**
     * Get progress percentage
     */
    getProgressPercent(current: number, total: number): number {
        if (total === 0) return 0
        return Math.round((current / total) * 100)
    }

    /**
     * Get elapsed time in seconds
     */
    getElapsedTime(): number {
        if (this.startTime === null) return 0
        return (Date.now() - this.startTime) / 1000
    }

    /**
     * Get fastest 5-second burst WPM
     */
    getFastestBurst(): number {
        if (this.keystrokes.length < 10) return 0

        let maxWPM = 0
        const burstWindow = 5000 // 5 seconds

        for (let i = 0; i < this.keystrokes.length; i++) {
            const windowStart = this.keystrokes[i].timestamp
            const windowEnd = windowStart + burstWindow

            const burstCorrect = this.keystrokes.filter(
                k => k.timestamp >= windowStart && k.timestamp < windowEnd && k.isCorrect
            ).length

            const burstWPM = calculateWPM(burstCorrect, 5)
            maxWPM = Math.max(maxWPM, burstWPM)
        }

        return maxWPM
    }

    /**
     * Get WPM consistency (lower = more consistent)
     * Returns standard deviation of 5-second WPM samples
     */
    getConsistency(): number {
        if (this.keystrokes.length < 20) return 0

        const samples: number[] = []
        const sampleInterval = 5000 // 5 seconds

        let currentWindow = this.startTime!
        while (currentWindow < this.keystrokes[this.keystrokes.length - 1].timestamp) {
            const windowEnd = currentWindow + sampleInterval
            const windowCorrect = this.keystrokes.filter(
                k => k.timestamp >= currentWindow && k.timestamp < windowEnd && k.isCorrect
            ).length
            samples.push(calculateWPM(windowCorrect, 5))
            currentWindow = windowEnd
        }

        if (samples.length < 2) return 0

        const mean = samples.reduce((a, b) => a + b, 0) / samples.length
        const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length
        return Math.round(Math.sqrt(variance))
    }

    /**
     * Check if there were errors in the last N characters
     */
    hasRecentErrors(n: number = 5): boolean {
        const recent = this.keystrokes.slice(-n)
        return recent.some(k => !k.isCorrect)
    }

    /**
     * Get comprehensive stats object
     */
    getStats() {
        return {
            wpm: this.getCurrentWPM(),
            rawWpm: this.getRawWPM(),
            accuracy: this.getAccuracy(),
            elapsedTime: this.getElapsedTime(),
            correctChars: this.correctChars,
            totalChars: this.totalChars,
            errorCount: this.totalChars - this.correctChars,
            fastestBurst: this.getFastestBurst(),
            consistency: this.getConsistency(),
        }
    }

    reset(): void {
        this.keystrokes = []
        this.startTime = null
        this.correctChars = 0
        this.totalChars = 0
    }
}
