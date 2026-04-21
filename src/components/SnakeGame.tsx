import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

type Point = { x: number; y: number };

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export default function SnakeGame({ onScoreUpdate }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
    setSpeed(150);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(50, prev - 2));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, speed, score, generateFood, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = head => i === 0 ? 15 : 5;
      ctx.shadowColor = i === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
      ctx.shadowBlur = 0;
    });

    // Draw Food
    ctx.fillStyle = '#ffff00';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffff00';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="glitch-border bg-void-black/80 backdrop-blur-sm p-1">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block"
        />
        
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-void-black/90 z-10"
          >
            <h2 className="text-neon-magenta text-4xl font-glitch mb-4 glitch-text">SYSTEM FAILURE</h2>
            <p className="text-neon-cyan text-xl mb-8 font-mono">SIGNAL_LOST: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-neon-cyan text-void-black font-glitch text-sm hover:bg-neon-magenta transition-colors shadow-[0_0_15px_#00ffff]"
            >
              REINITIALIZE
            </button>
          </motion.div>
        )}
      </div>

      <div className="mt-4 flex gap-4 text-xs font-mono text-neon-cyan/60 uppercase tracking-widest">
        <span>[ ARROW KEYS TO NAVIGATE ]</span>
        <span>[ TRANSMISSION RATE: {Math.round(200 - speed)}bps ]</span>
      </div>
    </div>
  );
}
