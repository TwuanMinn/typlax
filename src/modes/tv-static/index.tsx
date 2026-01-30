'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { lerp, clamp } from '@/lib/utils'

interface TVStaticModeProps {
    progress: number // 0-100
    wpm: number
    accuracy: number
}

export function TVStaticMode({ progress, wpm, accuracy }: TVStaticModeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [signalStatus, setSignalStatus] = useState<'WEAK' | 'FAIR' | 'GOOD' | 'STRONG'>('WEAK')

    useEffect(() => {
        // Update signal status based on WPM
        if (wpm >= 80) setSignalStatus('STRONG')
        else if (wpm >= 60) setSignalStatus('GOOD')
        else if (wpm >= 40) setSignalStatus('FAIR')
        else setSignalStatus('WEAK')
    }, [wpm])

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

        // The hidden image that emerges - a misty mountain landscape
        const drawHiddenImage = () => {
            const { width, height } = canvas

            // Dark atmospheric sky
            const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7)
            skyGradient.addColorStop(0, '#0a1a0a')
            skyGradient.addColorStop(0.3, '#1a2a1a')
            skyGradient.addColorStop(0.6, '#2a3a2a')
            skyGradient.addColorStop(1, '#3a4a3a')
            ctx.fillStyle = skyGradient
            ctx.fillRect(0, 0, width, height)

            // Distant mountains (layered for depth)
            // Layer 1 - furthest
            ctx.fillStyle = '#1a2a1a'
            ctx.beginPath()
            ctx.moveTo(0, height * 0.55)
            ctx.lineTo(width * 0.15, height * 0.4)
            ctx.lineTo(width * 0.3, height * 0.48)
            ctx.lineTo(width * 0.5, height * 0.35)
            ctx.lineTo(width * 0.65, height * 0.45)
            ctx.lineTo(width * 0.8, height * 0.38)
            ctx.lineTo(width, height * 0.5)
            ctx.lineTo(width, height * 0.6)
            ctx.lineTo(0, height * 0.6)
            ctx.closePath()
            ctx.fill()

            // Layer 2 - middle
            ctx.fillStyle = '#0f1f0f'
            ctx.beginPath()
            ctx.moveTo(0, height * 0.6)
            ctx.lineTo(width * 0.2, height * 0.5)
            ctx.lineTo(width * 0.4, height * 0.58)
            ctx.lineTo(width * 0.6, height * 0.48)
            ctx.lineTo(width * 0.75, height * 0.55)
            ctx.lineTo(width * 0.9, height * 0.52)
            ctx.lineTo(width, height * 0.6)
            ctx.lineTo(width, height * 0.7)
            ctx.lineTo(0, height * 0.7)
            ctx.closePath()
            ctx.fill()

            // Layer 3 - closest (dark silhouette)
            ctx.fillStyle = '#050f05'
            ctx.beginPath()
            ctx.moveTo(0, height * 0.7)
            ctx.lineTo(width * 0.1, height * 0.62)
            ctx.lineTo(width * 0.25, height * 0.68)
            ctx.lineTo(width * 0.4, height * 0.6)
            ctx.lineTo(width * 0.55, height * 0.66)
            ctx.lineTo(width * 0.7, height * 0.58)
            ctx.lineTo(width * 0.85, height * 0.65)
            ctx.lineTo(width, height * 0.62)
            ctx.lineTo(width, height)
            ctx.lineTo(0, height)
            ctx.closePath()
            ctx.fill()

            // Mist/fog effect
            const mistGradient = ctx.createLinearGradient(0, height * 0.5, 0, height * 0.8)
            mistGradient.addColorStop(0, 'rgba(20, 40, 20, 0)')
            mistGradient.addColorStop(0.5, 'rgba(30, 50, 30, 0.3)')
            mistGradient.addColorStop(1, 'rgba(10, 30, 10, 0.5)')
            ctx.fillStyle = mistGradient
            ctx.fillRect(0, height * 0.5, width, height * 0.3)
        }

        const draw = () => {
            const { width, height } = canvas

            // Clear with CRT black
            ctx.fillStyle = '#050805'
            ctx.fillRect(0, 0, width, height)

            // Draw the hidden image first
            drawHiddenImage()

            // Signal strength based on WPM
            const signalStrength = clamp(wpm / 80, 0, 1)

            // Image clarity based on accuracy and progress
            const clarity = (progress / 100) * (accuracy / 100)

            // Static overlay intensity (inverse of clarity)
            const staticIntensity = 1 - clarity

            if (staticIntensity > 0.01) {
                // Create static noise
                const imageData = ctx.getImageData(0, 0, width, height)
                const data = imageData.data

                // Add noise based on static intensity
                for (let i = 0; i < data.length; i += 4) {
                    // Random chance to add static based on intensity
                    if (Math.random() < staticIntensity * 0.6) {
                        const noise = Math.random() * 255
                        const noiseStrength = staticIntensity * (0.4 + signalStrength * 0.6)

                        // Green-tinted noise for CRT effect
                        data[i] = lerp(data[i], noise * 0.3, noiseStrength)     // R (reduced)
                        data[i + 1] = lerp(data[i + 1], noise, noiseStrength)   // G (full)
                        data[i + 2] = lerp(data[i + 2], noise * 0.3, noiseStrength) // B (reduced)
                    }
                }

                ctx.putImageData(imageData, 0, 0)

                // Horizontal scan lines (VHS effect)
                if (staticIntensity > 0.2) {
                    const scanLineCount = Math.floor(8 * staticIntensity)
                    for (let i = 0; i < scanLineCount; i++) {
                        const y = Math.random() * height
                        const lineHeight = 1 + Math.random() * 4
                        ctx.fillStyle = `rgba(0, 0, 0, ${staticIntensity * 0.4})`
                        ctx.fillRect(0, y, width, lineHeight)
                    }
                }

                // Vertical distortion bands
                if (staticIntensity > 0.4) {
                    const bandCount = Math.floor(3 * staticIntensity)
                    for (let i = 0; i < bandCount; i++) {
                        const y = Math.random() * height
                        const bandHeight = 20 + Math.random() * 40
                        const offset = (Math.random() - 0.5) * 10
                        ctx.save()
                        ctx.translate(offset, 0)
                        ctx.drawImage(canvas, 0, y, width, bandHeight, 0, y, width, bandHeight)
                        ctx.restore()
                    }
                }
            }

            // Green CRT glow overlay
            const glowGradient = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, Math.max(width, height) * 0.7
            )
            glowGradient.addColorStop(0, 'rgba(37, 244, 37, 0.02)')
            glowGradient.addColorStop(0.5, 'rgba(37, 244, 37, 0.01)')
            glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = glowGradient
            ctx.fillRect(0, 0, width, height)

            animationId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationId)
        }
    }, [progress, wpm, accuracy])

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Main canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ zIndex: 0 }}
            />

            {/* CRT Scanlines overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: `linear-gradient(
                        to bottom,
                        rgba(255,255,255,0),
                        rgba(255,255,255,0) 50%,
                        rgba(0,0,0,0.15) 50%,
                        rgba(0,0,0,0.15)
                    )`,
                    backgroundSize: '100% 3px',
                }}
            />

            {/* Vignette overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
                }}
            />

            {/* Screen flicker effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-30 bg-black"
                animate={{ opacity: [0, 0.02, 0, 0.01, 0] }}
                transition={{ duration: 0.15, repeat: Infinity }}
            />

            {/* Signal indicator in corner */}
            <motion.div
                className="absolute bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-2 rounded-lg 
                           bg-black/60 border border-[#25f425]/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {/* Signal bars */}
                <div className="flex items-end gap-1 h-5">
                    {[1, 2, 3, 4, 5].map((level) => {
                        const signalLevel = wpm >= 80 ? 5 : wpm >= 60 ? 4 : wpm >= 40 ? 3 : wpm >= 20 ? 2 : 1
                        const isActive = level <= signalLevel
                        return (
                            <motion.div
                                key={level}
                                className="w-1.5 rounded-sm"
                                style={{
                                    height: `${level * 4}px`,
                                    backgroundColor: isActive ? '#25f425' : 'rgba(37, 244, 37, 0.2)',
                                    boxShadow: isActive ? '0 0 6px #25f425' : 'none',
                                }}
                                animate={isActive ? { opacity: [0.8, 1, 0.8] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        )
                    })}
                </div>

                {/* Signal text */}
                <motion.span
                    className="text-xs font-mono tracking-wider"
                    style={{
                        color: '#25f425',
                        textShadow: '0 0 10px rgba(37, 244, 37, 0.5)',
                    }}
                    animate={{ opacity: signalStatus === 'WEAK' ? [0.5, 1, 0.5] : 1 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    {signalStatus}
                </motion.span>
            </motion.div>

            {/* REC indicator */}
            <motion.div
                className="absolute top-6 left-6 z-40 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-[#25f425]"
                    style={{ boxShadow: '0 0 10px #25f425' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
                <span
                    className="text-xs font-mono font-bold tracking-widest"
                    style={{
                        color: '#25f425',
                        textShadow: '0 0 8px rgba(37, 244, 37, 0.6)',
                    }}
                >
                    REC
                </span>
            </motion.div>

            {/* Progress indicator */}
            <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-1">
                <span
                    className="text-[10px] font-mono tracking-widest"
                    style={{ color: 'rgba(37, 244, 37, 0.6)' }}
                >
                    SIGNAL CLARITY
                </span>
                <div className="w-32 h-1.5 bg-[#25f425]/10 rounded-full overflow-hidden border border-[#25f425]/20">
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            backgroundColor: '#25f425',
                            boxShadow: '0 0 10px #25f425',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <span
                    className="text-xs font-mono font-bold"
                    style={{
                        color: '#25f425',
                        textShadow: '0 0 6px rgba(37, 244, 37, 0.5)',
                    }}
                >
                    {Math.round(progress)}% CLEARED
                </span>
            </div>
        </div>
    )
}
