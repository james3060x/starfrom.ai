'use client'

import { useEffect, useRef } from 'react'

export function FluidBackground() {
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

    const blobs = [
      { x: 0.3, y: 0.3, radius: 400, color: 'rgba(30, 100, 200, 0.4)', speed: 0.0003 },
      { x: 0.7, y: 0.6, radius: 500, color: 'rgba(80, 30, 150, 0.3)', speed: 0.0004 },
      { x: 0.5, y: 0.8, radius: 350, color: 'rgba(20, 80, 180, 0.35)', speed: 0.0005 },
      { x: 0.2, y: 0.7, radius: 300, color: 'rgba(60, 20, 120, 0.25)', speed: 0.00035 },
    ]

    const animate = () => {
      time += 1

      ctx.fillStyle = '#030305'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((blob, index) => {
        const offsetX = Math.sin(time * blob.speed + index * 2) * 100
        const offsetY = Math.cos(time * blob.speed * 0.8 + index * 3) * 80
        
        const x = blob.x * canvas.width + offsetX
        const y = blob.y * canvas.height + offsetY

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.radius)
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, '0.1)'))
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height)
      overlay.addColorStop(0, 'rgba(3, 3, 5, 0.3)')
      overlay.addColorStop(0.5, 'transparent')
      overlay.addColorStop(1, 'rgba(3, 3, 5, 0.3)')
      ctx.fillStyle = overlay
      ctx.fillRect(0, 0, canvas.width, canvas.height)

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
