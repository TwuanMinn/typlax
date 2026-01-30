'use client'

import { useEffect, useRef } from 'react'
import { lerp, clamp } from '@/lib/utils'

interface CarRacingModeProps {
    progress: number // 0-100
    wpm: number
    accuracy: number
}

export function CarRacingMode({ progress, wpm, accuracy }: CarRacingModeProps) {
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
        let roadOffset = 0

        const draw = () => {
            const { width, height } = canvas

            // Speed based on WPM
            const speed = clamp(wpm / 60, 0.3, 2)
            roadOffset += speed * 10

            // Sky gradient (gets brighter as race progresses)
            const skyBrightness = lerp(30, 80, progress / 100)
            const gradient = ctx.createLinearGradient(0, 0, 0, height * 0.5)
            gradient.addColorStop(0, `rgb(${skyBrightness}, ${skyBrightness + 20}, ${skyBrightness + 50})`)
            gradient.addColorStop(1, `rgb(${skyBrightness + 30}, ${skyBrightness + 50}, ${skyBrightness + 80})`)
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height * 0.5)

            // Ground/road area
            ctx.fillStyle = '#2a2a2a'
            ctx.fillRect(0, height * 0.5, width, height * 0.5)

            // Road perspective
            const roadTop = height * 0.5
            const roadBottom = height
            const roadTopWidth = width * 0.15
            const roadBottomWidth = width * 0.8

            // Road
            ctx.fillStyle = '#444'
            ctx.beginPath()
            ctx.moveTo((width - roadTopWidth) / 2, roadTop)
            ctx.lineTo((width + roadTopWidth) / 2, roadTop)
            ctx.lineTo((width + roadBottomWidth) / 2, roadBottom)
            ctx.lineTo((width - roadBottomWidth) / 2, roadBottom)
            ctx.closePath()
            ctx.fill()

            // Road markings (animated)
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 3
            ctx.setLineDash([30, 30])
            ctx.lineDashOffset = -roadOffset

            ctx.beginPath()
            ctx.moveTo(width / 2, roadTop)
            ctx.lineTo(width / 2, roadBottom)
            ctx.stroke()
            ctx.setLineDash([])

            // Side lines
            ctx.strokeStyle = '#ff0'
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.moveTo((width - roadTopWidth) / 2, roadTop)
            ctx.lineTo((width - roadBottomWidth) / 2, roadBottom)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo((width + roadTopWidth) / 2, roadTop)
            ctx.lineTo((width + roadBottomWidth) / 2, roadBottom)
            ctx.stroke()

            // Scenery (trees passing by)
            const numTrees = 6
            for (let i = 0; i < numTrees; i++) {
                const treeProgress = ((roadOffset / 100 + i / numTrees) % 1)
                const treeY = lerp(roadTop, roadBottom + 100, treeProgress)
                const treeScale = lerp(0.2, 1.5, treeProgress)
                const treeSide = i % 2 === 0 ? -1 : 1
                const treeX = width / 2 + treeSide * lerp(roadTopWidth / 2 + 50, roadBottomWidth / 2 + 100, treeProgress)

                if (treeY < roadBottom + 50 && treeY > roadTop - 50) {
                    drawTree(ctx, treeX, treeY, treeScale)
                }
            }

            // Car shake based on accuracy (lower accuracy = more shake)
            const shakeX = (accuracy < 90) ? (Math.random() - 0.5) * (100 - accuracy) * 0.3 : 0
            const shakeY = (accuracy < 90) ? (Math.random() - 0.5) * (100 - accuracy) * 0.2 : 0

            // Draw car
            const carX = width / 2 + shakeX
            const carY = height * 0.8 + shakeY
            drawCar(ctx, carX, carY, wpm)

            // Speed lines (motion blur effect at high speed)
            if (wpm > 50) {
                const lineCount = Math.floor((wpm - 50) / 10)
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
                ctx.lineWidth = 2

                for (let i = 0; i < lineCount; i++) {
                    const lineX = Math.random() * width
                    const lineY = roadTop + Math.random() * (roadBottom - roadTop)
                    const lineLength = 20 + wpm

                    ctx.beginPath()
                    ctx.moveTo(lineX, lineY)
                    ctx.lineTo(lineX, lineY + lineLength)
                    ctx.stroke()
                }
            }

            // Finish line approaching
            if (progress > 80) {
                const finishVisibility = (progress - 80) / 20
                const finishY = lerp(roadTop - 50, roadTop + 100, finishVisibility)

                // Checkered pattern
                ctx.fillStyle = '#fff'
                const checkerSize = 15
                const finishWidth = lerp(roadTopWidth, roadTopWidth * 1.5, finishVisibility)

                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 3; j++) {
                        if ((i + j) % 2 === 0) {
                            ctx.fillRect(
                                (width - finishWidth) / 2 + i * (finishWidth / 10),
                                finishY + j * checkerSize,
                                finishWidth / 10,
                                checkerSize
                            )
                        }
                    }
                }

                ctx.fillStyle = '#000'
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 3; j++) {
                        if ((i + j) % 2 === 1) {
                            ctx.fillRect(
                                (width - finishWidth) / 2 + i * (finishWidth / 10),
                                finishY + j * checkerSize,
                                finishWidth / 10,
                                checkerSize
                            )
                        }
                    }
                }
            }

            // HUD - Speedometer
            drawSpeedometer(ctx, 80, height - 80, wpm)

            // Progress as distance
            ctx.fillStyle = '#fff'
            ctx.font = '16px "JetBrains Mono", monospace'
            ctx.fillText(`${Math.round(progress * 10)}m / 1000m`, width - 150, 40)

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

function drawCar(ctx: CanvasRenderingContext2D, x: number, y: number, wpm: number) {
    ctx.save()
    ctx.translate(x, y)

    // Car body
    ctx.fillStyle = '#e94560'
    ctx.beginPath()
    ctx.roundRect(-40, -15, 80, 30, 5)
    ctx.fill()

    // Car top
    ctx.fillStyle = '#c73e54'
    ctx.beginPath()
    ctx.roundRect(-25, -30, 50, 20, 3)
    ctx.fill()

    // Windshield
    ctx.fillStyle = 'rgba(100, 200, 255, 0.7)'
    ctx.beginPath()
    ctx.moveTo(-20, -30)
    ctx.lineTo(-10, -40)
    ctx.lineTo(20, -40)
    ctx.lineTo(25, -30)
    ctx.closePath()
    ctx.fill()

    // Wheels
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.ellipse(-25, 15, 12, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(25, 15, 12, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // Headlights glow (brighter at higher speed)
    const glowIntensity = clamp(wpm / 100, 0.3, 1)
    ctx.fillStyle = `rgba(255, 255, 200, ${glowIntensity})`
    ctx.beginPath()
    ctx.ellipse(-30, 0, 5, 3, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(30, 0, 5, 3, 0, 0, Math.PI * 2)
    ctx.fill()

    // Exhaust (more at higher speed)
    if (wpm > 40) {
        const exhaustCount = Math.floor(wpm / 30)
        for (let i = 0; i < exhaustCount; i++) {
            ctx.fillStyle = `rgba(100, 100, 100, ${0.5 - i * 0.1})`
            ctx.beginPath()
            ctx.arc(-45 - i * 15, 10 + Math.random() * 10, 5 + i * 3, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    ctx.restore()
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)

    // Trunk
    ctx.fillStyle = '#4a3728'
    ctx.fillRect(-5, -40, 10, 40)

    // Foliage
    ctx.fillStyle = '#2d5016'
    ctx.beginPath()
    ctx.moveTo(0, -80)
    ctx.lineTo(-25, -40)
    ctx.lineTo(25, -40)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, -60)
    ctx.lineTo(-20, -30)
    ctx.lineTo(20, -30)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}

function drawSpeedometer(ctx: CanvasRenderingContext2D, x: number, y: number, wpm: number) {
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.beginPath()
    ctx.arc(x, y, 50, 0, Math.PI * 2)
    ctx.fill()

    // Border
    ctx.strokeStyle = '#e94560'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(x, y, 48, 0, Math.PI * 2)
    ctx.stroke()

    // Speed markings
    ctx.fillStyle = '#fff'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'

    // Needle
    const maxWPM = 120
    const angle = lerp(-0.75 * Math.PI, 0.75 * Math.PI, clamp(wpm / maxWPM, 0, 1)) - Math.PI / 2

    ctx.strokeStyle = '#e94560'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(angle) * 35, y + Math.sin(angle) * 35)
    ctx.stroke()

    // Center dot
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()

    // WPM text
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px "JetBrains Mono", monospace'
    ctx.fillText(`${wpm}`, x, y + 25)
    ctx.font = '8px sans-serif'
    ctx.fillText('WPM', x, y + 35)
}
