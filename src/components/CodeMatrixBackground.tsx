'use client';

import { useEffect, useRef } from 'react';

const CODE_SNIPPETS = [
  'const ai = new Agent();',
  'await model.generate();',
  'import { OpenAI } from "ai";',
  'function automate() {',
  'const response = await fetch();',
  'export default async function() {',
  'const vector = await embedding();',
  'if (confidence > 0.9) {',
  'return { success: true };',
  'const knowledge = await rag.search();',
  'async function handleMessage() {',
  'const context = await memory.get();',
  'await agent.execute(task);',
  'import { DifyClient } from "@dify";',
  'const result = await chain.run();',
  'await db.query(sql);',
  'const stream = await llm.chat();',
  'export interface AgentConfig {',
  'const tools = [search, calc];',
  'await workflow.trigger();',
  'const embedding = await embed();',
  'if (intent === "support") {',
  'return await api.call(data);',
  'const prompt = template.render();',
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]();=>@#$%&*+-';

interface CodeDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
  length: number;
}

export default function CodeMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dropsRef = useRef<CodeDrop[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);

    // Initialize drops
    dropsRef.current = [];
    for (let i = 0; i < columns; i++) {
      if (Math.random() > 0.7) {
        dropsRef.current.push({
          x: i * fontSize,
          y: Math.random() * canvas.height,
          speed: Math.random() * 2 + 1,
          chars: generateCharStream(Math.floor(Math.random() * 15 + 8)),
          opacity: Math.random() * 0.5 + 0.2,
          length: Math.floor(Math.random() * 15 + 8),
        });
      }
    }

    function generateCharStream(length: number): string[] {
      const useCode = Math.random() > 0.5;
      if (useCode) {
        const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        return snippet.split('').slice(0, length);
      }
      return Array(length).fill(null).map(() => CHARS[Math.floor(Math.random() * CHARS.length)]);
    }

    let frameCount = 0;

    const draw = () => {
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(3, 3, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (frameCount % 3 === 0) {
        dropsRef.current.forEach((drop) => {
          // Update position
          drop.y += drop.speed;

          // Reset if off screen
          if (drop.y > canvas.height) {
            drop.y = -drop.length * fontSize;
            drop.chars = generateCharStream(drop.length);
            drop.speed = Math.random() * 2 + 1;
            drop.opacity = Math.random() * 0.5 + 0.2;
          }
        });
      }

      // Draw drops
      dropsRef.current.forEach((drop) => {
        drop.chars.forEach((char, i) => {
          const y = drop.y + i * fontSize;

          if (y > 0 && y < canvas.height) {
            // Calculate opacity based on position in stream
            const charOpacity = drop.opacity * (1 - i / drop.length) * 0.8;

            // First character is brighter
            if (i === 0) {
              ctx.fillStyle = `rgba(6, 182, 212, ${Math.min(charOpacity * 2, 0.9)})`;
              ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
            } else {
              ctx.fillStyle = `rgba(6, 182, 212, ${charOpacity * 0.6})`;
              ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
            }

            ctx.fillText(char, drop.x, y);
          }
        });
      });

      frameCount++;
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.25 }}
    />
  );
}
