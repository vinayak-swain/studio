'use client';

import React, { useRef, useEffect } from 'react';

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: Disable alpha for background clearing
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    const mouse = {
      x: 0,
      y: 0,
    };

    const particles: Particle[] = [];
    const blueShades = ['#8ECAE6', '#219EBC', '#023047', '#126782'];
    const MAX_PARTICLES = 60; // Throttled particle count for better performance

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.color = blueShades[Math.floor(Math.random() * blueShades.length)];
        this.maxLife = Math.random() * 80 + 40;
        this.life = this.maxLife;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.life--;
        if (this.life <= 0) return;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1 && distance < 400) {
            this.x += dx * 0.015;
            this.y += dy * 0.015;
        }

        this.x += this.speedX;
        this.y += this.speedY;
      }
    }

    function addParticles() {
        if (particles.length < MAX_PARTICLES) {
            for (let i = 0; i < 2; i++) {
                particles.push(new Particle(mouse.x, mouse.y));
            }
        }
    }

    function animate() {
      if (!ctx) return;
      
      // Use standard clear for better perf on some browsers
      ctx.fillStyle = '#ffffff'; // Fallback to root bg color
      if (document.documentElement.classList.contains('dark')) {
          ctx.fillStyle = '#020617';
      }
      ctx.fillRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw();
        }
      }
      
      // Efficient line drawing with spatial consideration
      for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const distanceSq = dx * dx + dy * dy;

              if (distanceSq < 8000) { // 89 pixels squared
                  const distance = Math.sqrt(distanceSq);
                  const opacity = 1 - (distance / 89);
                  ctx.save();
                  ctx.globalAlpha = opacity * Math.min(p1.life / p1.maxLife, p2.life / p2.maxLife) * 0.5;
                  ctx.strokeStyle = p1.color;
                  ctx.lineWidth = 0.5;
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                  ctx.restore();
              }
          }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      addParticles();
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      mouse.x = width / 2;
      mouse.y = height / 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    handleResize();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
