'use client'

import { useEffect, useRef } from 'react'

interface Star {
    x: number
    y: number
    size: number
    alpha: number
    twinkleSpeed: number
    twinklePhase: number
}

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Create stars for a dense cosmic starfield
        const stars: Star[] = []
        const starCount = 250 // More stars for a denser field

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5, // Variable sizes
                alpha: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
            })
        }

        // Animation loop
        let animationId: number
        let time = 0

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            time += 0.016 // ~60fps timing

            stars.forEach((star) => {
                // Calculate twinkling alpha
                const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase)
                const currentAlpha = star.alpha * (0.5 + 0.5 * twinkle)

                // Draw star with glow effect
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 2
                )
                gradient.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha})`)
                gradient.addColorStop(0.5, `rgba(200, 200, 255, ${currentAlpha * 0.5})`)
                gradient.addColorStop(1, 'rgba(100, 100, 200, 0)')

                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                // Core of the star
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`
                ctx.fill()
            })

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
            aria-hidden="true"
        />
    )
}
