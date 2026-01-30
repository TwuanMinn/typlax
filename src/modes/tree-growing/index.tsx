'use client'

import { useEffect, useRef } from 'react'
import { lerp, clamp, smoothstep } from '@/lib/utils'

interface TreeGrowingModeProps {
    progress: number // 0-100
    wpm: number
    accuracy: number
}

export function TreeGrowingMode({ progress, wpm, accuracy }: TreeGrowingModeProps) {
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

        // Animation frame
        let animationId: number

        const draw = () => {
            const { width, height } = canvas

            // Clear canvas
            ctx.clearRect(0, 0, width, height)

            // Background gradient (earthy sky)
            const gradient = ctx.createLinearGradient(0, 0, 0, height)
            gradient.addColorStop(0, '#87ceeb') // Sky blue
            gradient.addColorStop(0.5, '#d4e7c5') // Pale green
            gradient.addColorStop(1, '#2d5016') // Dark green (ground)
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)

            // Ground
            ctx.fillStyle = '#3d5a1f'
            ctx.fillRect(0, height * 0.7, width, height * 0.3)

            // Tree trunk
            const trunkX = width / 2
            const trunkBaseY = height * 0.7
            const maxTrunkHeight = height * 0.4

            // Tree height based on progress
            const treeHeight = lerp(0, maxTrunkHeight, progress / 100)
            const trunkWidth = lerp(5, 30, clamp(progress / 50, 0, 1))

            // Draw trunk
            if (progress > 5) {
                ctx.fillStyle = '#5d4e37'
                ctx.beginPath()
                ctx.moveTo(trunkX - trunkWidth / 2, trunkBaseY)
                ctx.lineTo(trunkX + trunkWidth / 2, trunkBaseY)
                ctx.lineTo(trunkX + trunkWidth / 4, trunkBaseY - treeHeight)
                ctx.lineTo(trunkX - trunkWidth / 4, trunkBaseY - treeHeight)
                ctx.closePath()
                ctx.fill()
            }

            // Draw branches and leaves based on progress and WPM
            if (progress > 20) {
                const branchDensity = clamp(wpm / 80, 0.3, 1.0)
                const leafVibrancy = accuracy > 95 ? 1 : 0.6

                // Main canopy
                const canopyY = trunkBaseY - treeHeight
                const canopySize = lerp(20, 120, smoothstep(20, 100, progress))

                // Draw multiple leaf clusters
                const numClusters = Math.floor(branchDensity * 8) + 2
                for (let i = 0; i < numClusters; i++) {
                    const angle = (i / numClusters) * Math.PI * 2
                    const distance = canopySize * 0.6 * (0.5 + Math.random() * 0.5)
                    const clusterX = trunkX + Math.cos(angle) * distance * 0.8
                    const clusterY = canopyY - canopySize * 0.3 + Math.sin(angle) * distance * 0.4

                    // Draw leaf cluster
                    ctx.beginPath()
                    ctx.arc(clusterX, clusterY, canopySize * (0.3 + branchDensity * 0.2), 0, Math.PI * 2)

                    // Leaf color based on accuracy
                    const green = Math.floor(lerp(100, 180, leafVibrancy))
                    ctx.fillStyle = `rgba(${Math.floor(green * 0.4)}, ${green}, ${Math.floor(green * 0.3)}, 0.8)`
                    ctx.fill()
                }

                // Center canopy
                ctx.beginPath()
                ctx.arc(trunkX, canopyY, canopySize * 0.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(70, ${Math.floor(lerp(120, 160, leafVibrancy))}, 50, 0.9)`
                ctx.fill()
            }

            // Draw seed/sapling for early progress
            if (progress <= 20 && progress > 0) {
                const seedSize = lerp(5, 15, progress / 20)
                ctx.beginPath()
                ctx.arc(trunkX, trunkBaseY - seedSize, seedSize, 0, Math.PI * 2)
                ctx.fillStyle = '#4a7c2c'
                ctx.fill()

                // Small sprout
                if (progress > 5) {
                    ctx.strokeStyle = '#4a7c2c'
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(trunkX, trunkBaseY - seedSize * 2)
                    ctx.quadraticCurveTo(trunkX + 10, trunkBaseY - seedSize * 3, trunkX, trunkBaseY - seedSize * 4)
                    ctx.stroke()
                }
            }

            // Wind effect based on WPM (subtle sway)
            // This would be animated in a full implementation

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
