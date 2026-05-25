import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  alpha: number;
  targetAlpha: number;
  delay: number;
}

export default function TextHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];
    const text = "Я тебя люблю";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];

      const isMobile = window.innerWidth < 600;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 👇 уменьшил масштаб для телефона
      const scale = Math.min(canvas.width, canvas.height) / (isMobile ? 65 : 45);

      // 👇 уменьшил количество точек
      for (let t = 0; t < Math.PI * 2; t += (isMobile ? 0.12 : 0.06)) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
          alpha: 0,
          targetAlpha: 0.8,
          delay: Math.random() * 1500
        });
      }

      // 👇 меньше внутренних слоёв
      for (let s = 0.4; s < 1; s += 0.3) {
        for (let t = 0; t < Math.PI * 2; t += (isMobile ? 0.2 : 0.1)) {
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
          
          points.push({
            x: centerX + x * scale * s,
            y: centerY + y * scale * s,
            alpha: 0,
            targetAlpha: 0.5,
            delay: Math.random() * 2000
          });
        }
      }
    };

    let start: number | null = null;

    const draw = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = window.innerWidth < 600;

      // 👇 меньше текст на телефоне
      ctx.font = `${isMobile ? 10 : 14}px "Fira Code", monospace`;

      points.forEach(p => {
        if (elapsed > p.delay) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.03;
        }

        ctx.fillStyle = `rgba(255, 77, 109, ${p.alpha})`;
        ctx.fillText(text, p.x - ctx.measureText(text).width / 2, p.y);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}
