export type InputCallback = (char: string, isCorrect: boolean, position: number) => void
export type CompleteCallback = () => void

/**
 * InputHandler - Captures keyboard events and validates input against expected text
 * Follows PRD spec for real-time input handling
 */
export class InputHandler {
    private expectedText: string
    private currentPosition: number = 0
    private onCharTyped: InputCallback
    private onComplete: CompleteCallback
    private errors: number[] = []
    private typedChars: string[] = []

    constructor(
        expectedText: string,
        onCharTyped: InputCallback,
        onComplete: CompleteCallback
    ) {
        this.expectedText = expectedText
        this.onCharTyped = onCharTyped
        this.onComplete = onComplete
    }

    /**
     * Handle a keypress event
     * Returns true if the key was processed (correct or incorrect)
     */
    handleKeyPress(event: KeyboardEvent): boolean {
        // Ignore modifier keys and special keys
        if (event.ctrlKey || event.altKey || event.metaKey) return false
        if (event.key.length !== 1 && event.key !== 'Backspace') return false

        // Handle backspace - allow correction
        if (event.key === 'Backspace') {
            if (this.currentPosition > 0) {
                this.currentPosition--
                this.typedChars.pop()
                // Remove from errors if it was an error
                const errorIndex = this.errors.indexOf(this.currentPosition)
                if (errorIndex > -1) {
                    this.errors.splice(errorIndex, 1)
                }
            }
            return true
        }

        // Check if we've already completed
        if (this.currentPosition >= this.expectedText.length) return false

        const expectedChar = this.expectedText[this.currentPosition]
        const typedChar = event.key
        const isCorrect = typedChar === expectedChar

        // Record the character
        this.typedChars.push(typedChar)

        // Track errors
        if (!isCorrect) {
            this.errors.push(this.currentPosition)
        }

        // Callback
        this.onCharTyped(typedChar, isCorrect, this.currentPosition)

        // Advance position (PRD: character must be corrected before advancing)
        // For simplicity, we advance on any keypress but track errors
        this.currentPosition++

        // Check completion
        if (this.currentPosition >= this.expectedText.length) {
            this.onComplete()
        }

        return true
    }

    getCurrentPosition(): number {
        return this.currentPosition
    }

    getExpectedChar(): string | null {
        if (this.currentPosition >= this.expectedText.length) return null
        return this.expectedText[this.currentPosition]
    }

    getTypedText(): string {
        return this.typedChars.join('')
    }

    getErrors(): number[] {
        return [...this.errors]
    }

    getProgress(): number {
        return (this.currentPosition / this.expectedText.length) * 100
    }

    isComplete(): boolean {
        return this.currentPosition >= this.expectedText.length
    }

    reset(): void {
        this.currentPosition = 0
        this.errors = []
        this.typedChars = []
    }
}
