'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function GameOfLifeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gridRef = useRef<number[][]>([]);

  const CELL_SIZE = 8;
  const CELL_COLOR = 'rgba(6, 182, 212, 0.6)';
  const BG_COLOR = '#030305';

  const initializeGrid = useCallback((cols: number, rows: number) => {
    return Array(cols).fill(null).map(() => 
      Array(rows).fill(null).map(() => Math.random() > 0.85 ? 1 : 0)
    );
  }, []);

  const countNeighbors = useCallback((grid: number[][], x: number, y: number, cols: number, rows: number) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const ni = (x + i + cols) % cols;
        const nj = (y + j + rows) % rows;
        count += grid[ni][nj];
      }
    }
    return count;
  }, []);

  const updateGrid = useCallback((grid: number[][], cols: number, rows: number) => {
    const newGrid = grid.map(arr => [...arr]);
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const neighbors = countNeighbors(grid, i, j, cols, rows);
        
        if (grid[i][j] === 1) {
          newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          newGrid[i][j] = (neighbors === 3) ? 1 : 0;
        }
      }
    }
    
    return newGrid;
  }, [countNeighbors]);

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

    const cols = Math.ceil(canvas.width / CELL_SIZE);
    const rows = Math.ceil(canvas.height / CELL_SIZE);
    
    gridRef.current = initializeGrid(cols, rows);

    let frameCount = 0;
    
    const draw = () => {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (frameCount % 3 === 0) {
        gridRef.current = updateGrid(gridRef.current, cols, rows);
      }
      frameCount++;

      ctx.fillStyle = CELL_COLOR;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (gridRef.current[i][j]) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = CELL_COLOR;
            ctx.fillRect(
              i * CELL_SIZE, 
              j * CELL_SIZE, 
              CELL_SIZE - 1, 
              CELL_SIZE - 1
            );
            ctx.shadowBlur = 0;
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeGrid, updateGrid]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}
