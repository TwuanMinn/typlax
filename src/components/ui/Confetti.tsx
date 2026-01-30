'use client'

import { useEffect, useRef } from 'react'

interface ConfettiProps {
    isActive: boolean
}

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    rotation: number
    rotationSpeed: number
    lifetime: number
    maxLifetime: number
}

const COLORS = [
    '#4ade80', // green
    '#6b5fff', // purple
    '#fbbf24', // yellow
    '#60a5fa', // blue
    '#f472b6', // pink
    '#fb923c', // orange
]

export function Confetti({ isActive }: ConfettiProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!isActive) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles: Particle[] = []

        // Create initial burst of particles
        for (let i = 0; i < 150; i++) {
            particles.push(createParticle(canvas.width / 2, canvas.height * 0.3))
        }

        let animationId: number

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]

                // Update
                p.x += p.vx
                p.y += p.vy
                p.vy += 0.15 // gravity
                p.rotation += p.rotationSpeed
                p.lifetime++

                // Draw
                const alpha = 1 - (p.lifetime / p.maxLifetime)
                if (alpha <= 0) {
                    particles.splice(i, 1)
                    continue
                }

                ctx.save()
                ctx.translate(p.x, p.y)
                ctx.rotate(p.rotation)
                ctx.globalAlpha = alpha
                ctx.fillStyle = p.color
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
                ctx.restore()
            }

            if (particles.length > 0) {
                animationId = requestAnimationFrame(animate)
            }
        }

        animate()

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [isActive])

    if (!isActive) return null

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
        />
    )
}

function createParticle(centerX: number, centerY: number): Particle {
    const angle = Math.random() * Math.PI * 2
    const speed = 5 + Math.random() * 10

    return {
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        size: 6 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        lifetime: 0,
        maxLifetime: 100 + Math.random() * 50,
    }
}
