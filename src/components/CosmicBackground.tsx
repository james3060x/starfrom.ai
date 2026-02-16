'use client'

import { useEffect, useRef } from 'react'

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Stars
    const stars: { x: number; y: number; size: number; speed: number; brightness: number }[] = []
    const starCount = 200

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.02 + 0.01,
        brightness: Math.random(),
      })
    }

    // Nebulae
    const nebulae = [
      { x: 0.2, y: 0.3, color: 'rgba(0, 100, 255, 0.15)', radius: 300 },
      { x: 0.8, y: 0.7, color: 'rgba(150, 0, 200, 0.1)', radius: 400 },
      { x: 0.5, y: 0.5, color: 'rgba(0, 50, 150, 0.08)', radius: 500 },
    ]

    let time = 0

    const animate = () => {
      time += 0.001

      // Deep space gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#020204')
      gradient.addColorStop(0.5, '#050508')
      gradient.addColorStop(1, '#020204')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebulae with subtle animation
      nebulae.forEach((nebula, index) => {
        const x = nebula.x * canvas.width + Math.sin(time + index) * 50
        const y = nebula.y * canvas.height + Math.cos(time + index * 0.5) * 30
        
        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, nebula.radius)
        radialGradient.addColorStop(0, nebula.color)
        radialGradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = radialGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Draw stars
      stars.forEach((star) => {
        // Twinkle effect
        const twinkle = Math.sin(time * 2 + star.x * 0.01) * 0.3 + 0.7
        const alpha = star.brightness * twinkle

        // Subtle movement
        star.y -= star.speed
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width
        }

        // Draw star
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${alpha * 0.5})`)
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Cross sparkle for larger stars
        if (star.size > 1.2 && alpha > 0.8) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(star.x - star.size * 3, star.y)
          ctx.lineTo(star.x + star.size * 3, star.y)
          ctx.moveTo(star.x, star.y - star.size * 3)
          ctx.lineTo(star.x, star.y + star.size * 3)
          ctx.stroke()
        }
      })

      // Occasional shooting star
      if (Math.random() < 0.005) {
        const startX = Math.random() * canvas.width
        const startY = Math.random() * canvas.height * 0.5
        
        const shootGradient = ctx.createLinearGradient(startX, startY, startX - 100, startY + 50)
        shootGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        shootGradient.addColorStop(1, 'transparent')
        
        ctx.strokeStyle = shootGradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX - 100, startY + 50)
        ctx.stroke()
      }

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
