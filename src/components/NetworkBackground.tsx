import React, { useEffect, useRef } from 'react';

interface NetworkBackgroundProps {
  variant?: 'cyber-mesh' | 'radar' | 'constellation';
}

export const NetworkBackground: React.FC<NetworkBackgroundProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes representing IoT endpoints, edge gateways, and blockchain nodes
    const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
    
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      glowColor: string;
      pulse: number;
      pulseSpeed: number;
      type: 'iot' | 'gateway' | 'blockchain';
      ringRadius: number;
    }

    const particles: Particle[] = [];
    // Corporate SecureIoT AI Palette: Teal, Cyan, Sky, Emerald
    const colorPalette = [
      { color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.45)', type: 'iot' as const },
      { color: '#00828f', glow: 'rgba(0, 130, 143, 0.45)', type: 'gateway' as const },
      { color: '#0284c7', glow: 'rgba(2, 132, 199, 0.4)', type: 'blockchain' as const },
      { color: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', type: 'iot' as const },
    ];

    for (let i = 0; i < particleCount; i++) {
      const pConfig = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: pConfig.color,
        glowColor: pConfig.glow,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        type: pConfig.type,
        ringRadius: Math.random() * 14 + 10,
      });
    }

    // Floating security data packets moving along connections
    interface Packet {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      color: string;
    }

    const packets: Packet[] = [];
    const maxPackets = 12;

    const spawnPacket = () => {
      if (packets.length >= maxPackets || particles.length < 2) return;
      const from = Math.floor(Math.random() * particles.length);
      let closestIdx = -1;
      let minDistance = 140;

      for (let j = 0; j < particles.length; j++) {
        if (j === from) continue;
        const dx = particles[from].x - particles[j].x;
        const dy = particles[from].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDistance) {
          minDistance = d;
          closestIdx = j;
        }
      }

      if (closestIdx !== -1) {
        packets.push({
          fromIndex: from,
          toIndex: closestIdx,
          progress: 0,
          speed: 0.008 + Math.random() * 0.012,
          color: Math.random() > 0.4 ? '#00e5ff' : '#34d399',
        });
      }
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric ambient gradient matching #000028 and #001032
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        60,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, 'rgba(0, 16, 50, 0.4)');
      bgGrad.addColorStop(0.6, 'rgba(0, 7, 30, 0.7)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 40, 0.95)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle security grid coordinates (SOC defense matrix)
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Occasional grid marker intersection pluses
      ctx.fillStyle = 'rgba(0, 229, 255, 0.06)';
      for (let x = gridSize * 2; x < width; x += gridSize * 4) {
        for (let y = gridSize * 2; y < height; y += gridSize * 4) {
          ctx.fillRect(x - 2, y, 5, 1);
          ctx.fillRect(x, y - 2, 1, 5);
        }
      }

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) { p1.x = 0; p1.vx *= -1; }
        if (p1.x > width) { p1.x = width; p1.vx *= -1; }
        if (p1.y < 0) { p1.y = 0; p1.vy *= -1; }
        if (p1.y > height) { p1.y = height; p1.vy *= -1; }

        p1.pulse += p1.pulseSpeed;

        // Draw connections to nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.2;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Animated node glow
        const currentRadius = p1.radius + Math.sin(p1.pulse) * 0.6;
        
        // Node halo
        ctx.save();
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = p1.glowColor;
        ctx.globalAlpha = 0.22 + Math.sin(p1.pulse) * 0.12;
        ctx.fill();
        ctx.restore();

        // Node center
        ctx.fillStyle = p1.color;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Concentric radar ring on periodic nodes
        if (p1.type === 'gateway' || p1.type === 'blockchain') {
          const ringProgress = (Math.sin(p1.pulse) + 1) / 2;
          ctx.strokeStyle = p1.color;
          ctx.globalAlpha = (1 - ringProgress) * 0.22;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius + ringProgress * p1.ringRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }

      // Spawn & animate telemetry packets along active links
      if (tick % 24 === 0) {
        spawnPacket();
      }

      for (let k = packets.length - 1; k >= 0; k--) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const pStart = particles[pkt.fromIndex];
        const pEnd = particles[pkt.toIndex];
        if (!pStart || !pEnd) {
          packets.splice(k, 1);
          continue;
        }

        const currentX = pStart.x + (pEnd.x - pStart.x) * pkt.progress;
        const currentY = pStart.y + (pEnd.y - pStart.y) * pkt.progress;

        ctx.save();
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 15% 15%, rgba(0, 100, 110, 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(0, 229, 255, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(0, 0, 40, 0.5) 0%, transparent 70%)'
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00646e]/40 to-transparent" />
    </div>
  );
};
