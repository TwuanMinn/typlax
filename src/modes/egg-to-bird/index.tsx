'use client'

import { useEffect, useRef } from 'react'
import { lerp, clamp, smoothstep } from '@/lib/utils'

interface EggToBirdModeProps {
    progress: number // 0-100
    wpm: number
    accuracy: number
}

export function EggToBirdMode({ progress, wpm, accuracy }: EggToBirdModeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        let animationId: number

        const draw = () => {
            const { width, height } = canvas

            // Sky background
            const gradient = ctx.createLinearGradient(0, 0, 0, height)
            gradient.addColorStop(0, '#87ceeb')
            gradient.addColorStop(1, '#b8d4e0')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)

            // Clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            drawCloud(ctx, width * 0.2, height * 0.15, 60)
            drawCloud(ctx, width * 0.7, height * 0.1, 80)
            drawCloud(ctx, width * 0.5, height * 0.25, 50)

            const centerX = width / 2
            const nestY = height * 0.65

            // Draw nest
            ctx.fillStyle = '#8B4513'
            ctx.beginPath()
            ctx.ellipse(centerX, nestY, 80, 30, 0, 0, Math.PI * 2)
            ctx.fill()

            // Nest texture lines
            ctx.strokeStyle = '#654321'
            ctx.lineWidth = 2
            for (let i = 0; i < 10; i++) {
                ctx.beginPath()
                ctx.moveTo(centerX - 70 + i * 15, nestY - 5)
                ctx.quadraticCurveTo(centerX - 60 + i * 15, nestY + 10, centerX - 50 + i * 15, nestY - 3)
                ctx.stroke()
            }

            if (progress < 30) {
                // Stage 1: Intact egg with forming cracks
                drawEgg(ctx, centerX, nestY - 40, progress)
            } else if (progress < 60) {
                // Stage 2: Cracking egg, chick emerging
                drawCrackingEgg(ctx, centerX, nestY - 40, progress)
            } else if (progress < 85) {
                // Stage 3: Chick in nest
                const chickY = nestY - 30
                drawChick(ctx, centerX, chickY, progress, wpm)
            } else {
                // Stage 4: Bird flying
                const flyProgress = (progress - 85) / 15
                const birdX = centerX + flyProgress * (width * 0.3)
                const birdY = nestY - 30 - flyProgress * (height * 0.4)
                drawBird(ctx, birdX, birdY, wpm, flyProgress)

                // Show empty nest
                ctx.fillStyle = 'rgba(139, 69, 19, 0.5)'
                ctx.beginPath()
                ctx.ellipse(centerX, nestY - 10, 40, 15, 0, 0, Math.PI)
                ctx.fill()
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

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath()
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
    ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2)
    ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2)
    ctx.arc(x + size * 0.4, y + size * 0.15, size * 0.35, 0, Math.PI * 2)
    ctx.fill()
}

function drawEgg(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
    // Egg shape
    ctx.fillStyle = '#f0e5d8'
    ctx.beginPath()
    ctx.ellipse(x, y, 35, 45, 0, 0, Math.PI * 2)
    ctx.fill()

    // Egg highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.beginPath()
    ctx.ellipse(x - 10, y - 15, 8, 12, -0.3, 0, Math.PI * 2)
    ctx.fill()

    // Small cracks appearing
    if (progress > 15) {
        ctx.strokeStyle = '#8B7355'
        ctx.lineWidth = 2
        const crackIntensity = (progress - 15) / 15

        ctx.beginPath()
        ctx.moveTo(x - 5, y - 20)
        ctx.lineTo(x + 5 * crackIntensity, y - 10)
        ctx.lineTo(x - 3 * crackIntensity, y)
        ctx.stroke()
    }
}

function drawCrackingEgg(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
    const crackProgress = (progress - 30) / 30

    // Bottom half of egg
    ctx.fillStyle = '#f0e5d8'
    ctx.beginPath()
    ctx.ellipse(x, y + 10, 35, 30, 0, 0, Math.PI)
    ctx.fill()

    // Top half lifting/breaking
    ctx.save()
    ctx.translate(x, y - 20)
    ctx.rotate(-crackProgress * 0.5)
    ctx.translate(-x, -(y - 20))

    ctx.fillStyle = '#f0e5d8'
    ctx.beginPath()
    ctx.ellipse(x - crackProgress * 20, y - 20 - crackProgress * 30, 30, 25, 0, Math.PI, 0)
    ctx.fill()
    ctx.restore()

    // Emerging chick head
    if (crackProgress > 0.3) {
        const emerge = (crackProgress - 0.3) / 0.7
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(x, y - 10 - emerge * 20, 15 * emerge, 0, Math.PI * 2)
        ctx.fill()

        // Eyes
        if (emerge > 0.5) {
            ctx.fillStyle = '#000'
            ctx.beginPath()
            ctx.arc(x - 5, y - 15 - emerge * 20, 3, 0, Math.PI * 2)
            ctx.arc(x + 5, y - 15 - emerge * 20, 3, 0, Math.PI * 2)
            ctx.fill()
        }
    }
}

function drawChick(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number, wpm: number) {
    const bounce = Math.sin(Date.now() / 200) * 3

    // Body
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.ellipse(x, y + bounce, 25, 30, 0, 0, Math.PI * 2)
    ctx.fill()

    // Head
    ctx.beginPath()
    ctx.arc(x, y - 25 + bounce, 20, 0, Math.PI * 2)
    ctx.fill()

    // Beak
    ctx.fillStyle = '#FFA500'
    ctx.beginPath()
    ctx.moveTo(x, y - 25 + bounce)
    ctx.lineTo(x + 12, y - 22 + bounce)
    ctx.lineTo(x, y - 18 + bounce)
    ctx.closePath()
    ctx.fill()

    // Eyes
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(x - 7, y - 28 + bounce, 4, 0, Math.PI * 2)
    ctx.arc(x + 3, y - 28 + bounce, 4, 0, Math.PI * 2)
    ctx.fill()

    // Small wings flapping based on WPM
    const wingFlap = Math.sin(Date.now() / (200 - wpm)) * 0.3
    ctx.fillStyle = '#DAA520'

    ctx.save()
    ctx.translate(x - 25, y - 5 + bounce)
    ctx.rotate(-0.5 + wingFlap)
    ctx.beginPath()
    ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.translate(x + 25, y - 5 + bounce)
    ctx.rotate(0.5 - wingFlap)
    ctx.beginPath()
    ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
}

function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, wpm: number, flyProgress: number) {
    const wingFlap = Math.sin(Date.now() / 100) * 0.8
    const size = lerp(1, 0.6, flyProgress) // Gets smaller as flies away

    ctx.save()
    ctx.translate(x, y)
    ctx.scale(size, size)

    // Body
    ctx.fillStyle = '#4a90a4'
    ctx.beginPath()
    ctx.ellipse(0, 0, 30, 20, 0.2, 0, Math.PI * 2)
    ctx.fill()

    // Head
    ctx.beginPath()
    ctx.arc(25, -10, 15, 0, Math.PI * 2)
    ctx.fill()

    // Beak
    ctx.fillStyle = '#FFA500'
    ctx.beginPath()
    ctx.moveTo(35, -10)
    ctx.lineTo(50, -8)
    ctx.lineTo(35, -5)
    ctx.closePath()
    ctx.fill()

    // Eye
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(30, -12, 3, 0, Math.PI * 2)
    ctx.fill()

    // Wings
    ctx.fillStyle = '#3a7a94'
    ctx.save()
    ctx.rotate(wingFlap)
    ctx.beginPath()
    ctx.ellipse(-10, -25, 35, 12, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Tail
    ctx.beginPath()
    ctx.moveTo(-25, 0)
    ctx.lineTo(-45, -10)
    ctx.lineTo(-45, 10)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}
