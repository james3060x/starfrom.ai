'use client'

import { useEffect, useRef } from 'react'

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const waves = [
      { y: 0.3, length: 400, amplitude: 80, speed: 0.3, color: 'rgba(0, 100, 255, 0.08)', offset: Math.random() * Math.PI * 2 },
      { y: 0.4, length: 500, amplitude: 60, speed: 0.25, color: 'rgba(100, 0, 200, 0.06)', offset: Math.random() * Math.PI * 2 },
      { y: 0.5, length: 600, amplitude: 100, speed: 0.2, color: 'rgba(0, 150, 255, 0.05)', offset: Math.random() * Math.PI * 2 },
      { y: 0.6, length: 450, amplitude: 70, speed: 0.35, color: 'rgba(150, 50, 255, 0.04)', offset: Math.random() * Math.PI * 2 },
    ]

    const animate = () => {
      time += 0.01

      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGradient.addColorStop(0, '#030305')
      bgGradient.addColorStop(0.5, '#050508')
      bgGradient.addColorStop(1, '#030305')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = wave.y * canvas.height + 
            Math.sin((x / wave.length) + time * wave.speed + wave.offset) * wave.amplitude +
            Math.sin((x / (wave.length * 0.5)) + time * wave.speed * 1.5 + wave.offset) * (wave.amplitude * 0.5)
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(0, wave.y * canvas.height - wave.amplitude, 0, canvas.height)
        gradient.addColorStop(0, wave.color)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
    />
  )
}
