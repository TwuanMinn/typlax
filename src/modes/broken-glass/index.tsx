'use client'

import { useEffect, useRef } from 'react'
import { lerp, clamp } from '@/lib/utils'

interface BrokenGlassModeProps {
    progress: number // 0-100
    wpm: number
    accuracy: number
}

interface Crack {
    x: number
    y: number
    angle: number
    length: number
    branches: { angle: number; length: number }[]
}

export function BrokenGlassMode({ progress, wpm, accuracy }: BrokenGlassModeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const cracksRef = useRef<Crack[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            // Regenerate cracks on resize
            cracksRef.current = generateCracks(canvas.width, canvas.height)
        }
        resize()
        window.addEventListener('resize', resize)

        // Generate cracks once
        if (cracksRef.current.length === 0) {
            cracksRef.current = generateCracks(canvas.width, canvas.height)
        }

        let animationId: number

        const draw = () => {
            const { width, height } = canvas

            // Calculate healing progress
            const healProgress = progress / 100
            const healSpeed = clamp(accuracy / 100, 0.5, 1)

            // Background - gets clearer with progress
            const bgBrightness = lerp(20, 60, healProgress)
            ctx.fillStyle = `rgb(${bgBrightness}, ${bgBrightness + 10}, ${bgBrightness + 30})`
            ctx.fillRect(0, 0, width, height)

            // Draw the cleared center area (expands with progress)
            const clearRadius = Math.min(width, height) * 0.5 * healProgress

            if (healProgress > 0.1) {
                const clearGradient = ctx.createRadialGradient(
                    width / 2, height / 2, 0,
                    width / 2, height / 2, clearRadius
                )
                clearGradient.addColorStop(0, 'rgba(219, 234, 254, 0.9)')
                clearGradient.addColorStop(0.7, 'rgba(96, 165, 250, 0.5)')
                clearGradient.addColorStop(1, 'rgba(96, 165, 250, 0)')

                ctx.fillStyle = clearGradient
                ctx.beginPath()
                ctx.arc(width / 2, height / 2, clearRadius, 0, Math.PI * 2)
                ctx.fill()
            }

            // Draw cracks (fade with healing)
            const crackOpacity = 1 - healProgress

            if (crackOpacity > 0.05) {
                cracksRef.current.forEach((crack) => {
                    // Check if crack is within healing radius
                    const distFromCenter = Math.sqrt(
                        Math.pow(crack.x - width / 2, 2) + Math.pow(crack.y - height / 2, 2)
                    )
                    const maxDist = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
                    const crackHealFactor = clamp((distFromCenter / maxDist - healProgress) * 2, 0, 1)

                    if (crackHealFactor > 0.05) {
                        drawCrack(ctx, crack, crackHealFactor * crackOpacity)
                    }
                })
            }

            // Glass sheen effect
            ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + healProgress * 0.1})`
            ctx.beginPath()
            ctx.ellipse(width * 0.3, height * 0.3, width * 0.15, height * 0.1, -0.5, 0, Math.PI * 2)
            ctx.fill()

            // Sparkle effects on healing (based on WPM)
            if (wpm > 30 && healProgress > 0.2) {
                const sparkleCount = Math.floor(wpm / 20)
                for (let i = 0; i < sparkleCount; i++) {
                    const sparkleX = width / 2 + (Math.random() - 0.5) * clearRadius * 2
                    const sparkleY = height / 2 + (Math.random() - 0.5) * clearRadius * 2
                    const sparkleSize = 2 + Math.random() * 3

                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`
                    ctx.beginPath()
                    ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            // Pristine state at 100%
            if (healProgress > 0.95) {
                ctx.fillStyle = 'rgba(219, 234, 254, 0.3)'
                ctx.fillRect(0, 0, width, height)
            }

            animationId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationId)
        }
    }, [progress, wpm, accuracy])

    return (
        <canvas ref={canvasRef} className="absolute inset-0" style={{ zIndex: 0 }} />
    )
}

function generateCracks(width: number, height: number): Crack[] {
    const cracks: Crack[] = []
    const centerX = width / 2
    const centerY = height / 2

    // Generate cracks radiating from center
    const numMainCracks = 12
    for (let i = 0; i < numMainCracks; i++) {
        const angle = (i / numMainCracks) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
        const length = 100 + Math.random() * Math.min(width, height) * 0.4

        const branches: { angle: number; length: number }[] = []
        const numBranches = 3 + Math.floor(Math.random() * 5)

        for (let j = 0; j < numBranches; j++) {
            branches.push({
                angle: angle + (Math.random() - 0.5) * 1.2,
                length: 30 + Math.random() * 80,
            })
        }

        cracks.push({
            x: centerX,
            y: centerY,
            angle,
            length,
            branches,
        })
    }

    // Add some random cracks
    for (let i = 0; i < 20; i++) {
        cracks.push({
            x: Math.random() * width,
            y: Math.random() * height,
            angle: Math.random() * Math.PI * 2,
            length: 20 + Math.random() * 100,
            branches: [
                { angle: Math.random() * Math.PI * 2, length: 10 + Math.random() * 40 },
                { angle: Math.random() * Math.PI * 2, length: 10 + Math.random() * 40 },
            ],
        })
    }

    return cracks
}

function drawCrack(ctx: CanvasRenderingContext2D, crack: Crack, opacity: number) {
    ctx.strokeStyle = `rgba(200, 220, 255, ${opacity * 0.8})`
    ctx.lineWidth = 1 + Math.random()
    ctx.lineCap = 'round'

    // Main crack line with jitter
    ctx.beginPath()
    ctx.moveTo(crack.x, crack.y)

    let currentX = crack.x
    let currentY = crack.y
    const segments = 5

    for (let i = 0; i < segments; i++) {
        const segmentLength = crack.length / segments
        const jitter = (Math.random() - 0.5) * 0.2
        currentX += Math.cos(crack.angle + jitter) * segmentLength
        currentY += Math.sin(crack.angle + jitter) * segmentLength
        ctx.lineTo(currentX, currentY)
    }
    ctx.stroke()

    // Draw branches
    crack.branches.forEach((branch, i) => {
        const branchStart = lerp(0.2, 0.8, i / crack.branches.length)
        const startX = crack.x + Math.cos(crack.angle) * crack.length * branchStart
        const startY = crack.y + Math.sin(crack.angle) * crack.length * branchStart

        ctx.strokeStyle = `rgba(200, 220, 255, ${opacity * 0.5})`
        ctx.lineWidth = 0.5 + Math.random() * 0.5

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(
            startX + Math.cos(branch.angle) * branch.length,
            startY + Math.sin(branch.angle) * branch.length
        )
        ctx.stroke()
    })
}
