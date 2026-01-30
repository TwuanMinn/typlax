import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

/**
 * Smoothstep interpolation
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
}

/**
 * Calculate WPM from characters typed and time elapsed
 * Standard: 5 characters = 1 word
 */
export function calculateWPM(correctChars: number, timeSeconds: number): number {
    if (timeSeconds <= 0) return 0
    const minutes = timeSeconds / 60
    const words = correctChars / 5
    return Math.round(words / minutes)
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correctChars: number, totalChars: number): number {
    if (totalChars === 0) return 100
    return Math.round((correctChars / totalChars) * 100)
}

/**
 * Format time in MM:SS
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Ease-in-out cubic function
 */
export function easeInOutCubic(t: number): number {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
}
