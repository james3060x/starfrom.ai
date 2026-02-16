'use client'

import { useEffect, useRef } from 'react'

export function ElegantBackground() {
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

    type Particle = {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
    }

    const particles: Particle[] = []
    const particleCount = 25

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      })
    }

    const animate = () => {
      time += 0.016

      ctx.fillStyle = '#030305'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time * 0.2) * 100,
        canvas.height * 0.3 + Math.cos(time * 0.15) * 50,
        0,
        canvas.width * 0.3 + Math.sin(time * 0.2) * 100,
        canvas.height * 0.3 + Math.cos(time * 0.15) * 50,
        500
      )
      gradient1.addColorStop(0, 'rgba(40, 80, 160, 0.15)')
      gradient1.addColorStop(0.5, 'rgba(40, 80, 160, 0.05)')
      gradient1.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(time * 0.25) * 80,
        canvas.height * 0.6 + Math.sin(time * 0.2) * 60,
        0,
        canvas.width * 0.7 + Math.cos(time * 0.25) * 80,
        canvas.height * 0.6 + Math.sin(time * 0.2) * 60,
        600
      )
      gradient2.addColorStop(0, 'rgba(80, 40, 140, 0.12)')
      gradient2.addColorStop(0.5, 'rgba(80, 40, 140, 0.04)')
      gradient2.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const gradient3 = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time * 0.1) * 150,
        canvas.height * 0.8 + Math.cos(time * 0.12) * 40,
        0,
        canvas.width * 0.5 + Math.sin(time * 0.1) * 150,
        canvas.height * 0.8 + Math.cos(time * 0.12) * 40,
        400
      )
      gradient3.addColorStop(0, 'rgba(20, 100, 180, 0.1)')
      gradient3.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        const pulse = Math.sin(time * 2 + particle.x * 0.01) * 0.3 + 0.7
        const alpha = particle.alpha * pulse

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, `rgba(100, 150, 255, ${alpha})`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.strokeStyle = 'rgba(100, 150, 255, 0.03)'
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.1
            ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
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
