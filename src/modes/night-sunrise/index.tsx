'use client'

import { useEffect, useRef } from 'react'
import { lerp, easeInOutCubic } from '@/lib/utils'

interface NightSunriseModeProps {
    progress: number // 0-100
    wpm: number
    accuracy: number
}

export function NightSunriseMode({ progress, wpm, accuracy }: NightSunriseModeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        let animationId: number

        const draw = () => {
            const { width, height } = canvas

            // Calculate sun position (rises from bottom to top)
            const sunProgress = easeInOutCubic(progress / 100)
            const sunY = lerp(height * 0.9, height * 0.2, sunProgress)
            const sunX = width / 2

            // Sky gradient based on progress
            const gradient = ctx.createLinearGradient(0, 0, 0, height)

            if (progress < 30) {
                // Night sky
                gradient.addColorStop(0, '#0c1445')
                gradient.addColorStop(0.5, '#1e3a5f')
                gradient.addColorStop(1, '#0c1445')
            } else if (progress < 60) {
                // Dawn
                const t = (progress - 30) / 30
                gradient.addColorStop(0, lerpColor('#0c1445', '#2d4a6e', t))
                gradient.addColorStop(0.4, lerpColor('#1e3a5f', '#ff6b35', t))
                gradient.addColorStop(0.7, lerpColor('#1e3a5f', '#ffd93d', t * 0.5))
                gradient.addColorStop(1, lerpColor('#0c1445', '#ff8c42', t))
            } else {
                // Sunrise to day
                const t = (progress - 60) / 40
                gradient.addColorStop(0, lerpColor('#2d4a6e', '#87ceeb', t))
                gradient.addColorStop(0.3, lerpColor('#ff6b35', '#ffd93d', t))
                gradient.addColorStop(0.6, lerpColor('#ffd93d', '#fff5e1', t))
                gradient.addColorStop(1, lerpColor('#ff8c42', '#ffb366', t))
            }

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)

            // Stars (fade out with progress)
            const starOpacity = 1 - (progress / 100)
            if (starOpacity > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity * 0.8})`
                const starCount = 50
                for (let i = 0; i < starCount; i++) {
                    // Use deterministic positions based on index
                    const x = ((i * 137.5) % width)
                    const y = ((i * 97.3) % (height * 0.6))
                    const size = 1 + (i % 3)

                    ctx.beginPath()
                    ctx.arc(x, y, size, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            // Sun
            const sunSize = lerp(0, 80, Math.min(progress / 30, 1))

            // Sun glow
            const glowGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunSize * 3)
            glowGradient.addColorStop(0, `rgba(255, 217, 61, ${0.3 + wpm / 200})`)
            glowGradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.2)')
            glowGradient.addColorStop(1, 'rgba(255, 107, 53, 0)')

            ctx.fillStyle = glowGradient
            ctx.beginPath()
            ctx.arc(sunX, sunY, sunSize * 3, 0, Math.PI * 2)
            ctx.fill()

            // Sun body
            const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunSize)
            sunGradient.addColorStop(0, '#fff5e1')
            sunGradient.addColorStop(0.5, '#ffd93d')
            sunGradient.addColorStop(1, '#ff6b35')

            ctx.fillStyle = sunGradient
            ctx.beginPath()
            ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2)
            ctx.fill()

            // Horizon line
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
            ctx.fillRect(0, height * 0.85, width, 2)

            // Ground silhouette
            ctx.fillStyle = '#1a1a2e'
            ctx.beginPath()
            ctx.moveTo(0, height * 0.85)
            ctx.lineTo(width * 0.2, height * 0.82)
            ctx.lineTo(width * 0.4, height * 0.86)
            ctx.lineTo(width * 0.6, height * 0.83)
            ctx.lineTo(width * 0.8, height * 0.87)
            ctx.lineTo(width, height * 0.84)
            ctx.lineTo(width, height)
            ctx.lineTo(0, height)
            ctx.closePath()
            ctx.fill()

            animationId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationId)
        }
    }, [progress, wpm, accuracy])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ zIndex: 0 }}
        />
    )
}

// Helper function to interpolate between two hex colors
function lerpColor(color1: string, color2: string, t: number): string {
    const c1 = hexToRgb(color1)
    const c2 = hexToRgb(color2)

    const r = Math.round(lerp(c1.r, c2.r, t))
    const g = Math.round(lerp(c1.g, c2.g, t))
    const b = Math.round(lerp(c1.b, c2.b, t))

    return `rgb(${r}, ${g}, ${b})`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
}
