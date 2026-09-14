/**
 * =========================================================================
 * 🌸 SAKURA PETAL & CELEBRATION CANVAS ENGINE 🌸
 * =========================================================================
 * Ultra-smooth 60fps particle physics with 3D petal tumbling, wind turbulence,
 * glowing light motes, and romantic heart confetti bursts.
 */

class SakuraEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.petals = [];
    this.sparkles = [];
    this.hearts = [];
    this.confetti = [];
    
    this.maxPetals = 45;
    this.wind = { current: 0.8, target: 0.8 };
    this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    this.lastMouse = { x: -1000, y: -1000 };
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse breeze interaction
    window.addEventListener('mousemove', (e) => {
      this.mouse.vx = (e.clientX - this.lastMouse.x) * 0.05;
      this.mouse.vy = (e.clientY - this.lastMouse.y) * 0.05;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.lastMouse.x = e.clientX;
      this.lastMouse.y = e.clientY;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        this.mouse.vx = (t.clientX - this.lastMouse.x) * 0.05;
        this.mouse.vy = (t.clientY - this.lastMouse.y) * 0.05;
        this.mouse.x = t.clientX;
        this.mouse.y = t.clientY;
        this.lastMouse.x = t.clientX;
        this.lastMouse.y = t.clientY;
      }
    }, { passive: true });

    // Seed initial petals across screen
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }

    // Seed gentle background light motes (fireflies)
    for (let i = 0; i < 25; i++) {
      this.sparkles.push(this.createSparkle(true));
    }

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createPetal(randomY = false) {
    const depth = Math.random(); // 0 (far) to 1 (near)
    const scale = 0.6 + depth * 0.8;
    return {
      x: Math.random() * (this.width + 200) - 100,
      y: randomY ? Math.random() * this.height : -30 - Math.random() * 50,
      size: (12 + Math.random() * 10) * scale,
      speedY: (1.0 + Math.random() * 1.5) * scale,
      speedX: (0.4 + Math.random() * 0.8),
      depth: depth,
      opacity: 0.5 + depth * 0.5,
      // 3D rotation parameters
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI,
      flipSpeed: 0.015 + Math.random() * 0.03,
      swayOffset: Math.random() * 100,
      // Colors: soft gradient between cherry blossom rose and blush white
      color1: `rgba(255, ${Math.floor(180 + Math.random() * 35)}, ${Math.floor(195 + Math.random() * 30)}, `,
      color2: `rgba(255, ${Math.floor(215 + Math.random() * 30)}, ${Math.floor(225 + Math.random() * 20)}, `
    };
  }

  createSparkle(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : Math.random() * this.height,
      radius: 1 + Math.random() * 2.5,
      alpha: Math.random() * 0.7,
      baseAlpha: 0.2 + Math.random() * 0.5,
      pulseSpeed: 0.015 + Math.random() * 0.03,
      pulsePhase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4
    };
  }

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    
    // Simulate 3D rotation by scaling along Y axis
    const flipScale = Math.sin(p.flip);
    ctx.scale(1, flipScale);

    ctx.beginPath();
    // Beautiful natural petal curved shape using cubic beziers
    const s = p.size;
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.8, -s * 0.6, s * 0.9, s * 0.4, 0, s);
    ctx.bezierCurveTo(-s * 0.9, s * 0.4, -s * 0.8, -s * 0.6, 0, -s);

    const grad = ctx.createRadialGradient(0, -s * 0.3, s * 0.1, 0, 0, s);
    grad.addColorStop(0, p.color1 + (p.opacity * 0.95) + ')');
    grad.addColorStop(1, p.color2 + (p.opacity * 0.6) + ')');
    
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(255, 182, 193, 0.4)';
    ctx.shadowBlur = p.depth > 0.7 ? 8 : 2;
    ctx.fill();

    // Subtle petal center vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.lineTo(0, s * 0.4);
    ctx.strokeStyle = 'rgba(255, 140, 160, ' + (p.opacity * 0.4) + ')';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  drawHeart(h) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rot);
    ctx.scale(h.scale, h.scale);
    ctx.globalAlpha = h.alpha;

    const s = h.size;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
    ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
    ctx.fillStyle = h.color;
    ctx.shadowColor = h.color;
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.restore();
  }

  // Trigger heart and petal burst (e.g. for Stage Success & YES button)
  burstHearts(x, y, count = 25) {
    const colors = [
      '#ff4081', '#ff79b0', '#f48fb1', '#f06292', '#ff80ab', '#ffd54f', '#ffb74d'
    ];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 8;
      this.hearts.push({
        x: x || this.width / 2,
        y: y || this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 10 + Math.random() * 14,
        scale: 0.1,
        targetScale: 0.8 + Math.random() * 0.8,
        rot: (Math.random() - 0.5) * 1.5,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: 0.012 + Math.random() * 0.01
      });
    }
  }

  // Trigger petal whirlwind
  burstPetals(count = 35) {
    for (let i = 0; i < count; i++) {
      const p = this.createPetal();
      p.x = Math.random() * this.width;
      p.y = -20 - Math.random() * 100;
      p.speedY *= 1.8;
      this.petals.push(p);
    }
  }

  // Grand celebration confetti + hearts + fireworks for proposal
  grandCelebration() {
    this.burstHearts(this.width / 2, this.height * 0.45, 60);
    this.burstPetals(80);
    
    // Colorful confetti ribbons
    const ribbonColors = ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1', '#ba68c8', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 11;
      this.confetti.push({
        x: this.width / 2,
        y: this.height * 0.45,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 4,
        w: 6 + Math.random() * 8,
        h: 12 + Math.random() * 14,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        color: ribbonColors[Math.floor(Math.random() * ribbonColors.length)],
        alpha: 1,
        gravity: 0.16
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Natural wind oscillation
    this.wind.current += (Math.sin(Date.now() * 0.0008) * 0.8 - this.wind.current) * 0.02;

    // 1. Draw glowing motes
    for (let s of this.sparkles) {
      s.pulsePhase += s.pulseSpeed;
      s.alpha = s.baseAlpha + Math.sin(s.pulsePhase) * 0.25;
      s.x += s.vx;
      s.y += s.vy;

      if (s.y < -10) s.y = this.height + 10;
      if (s.x < 0) s.x = this.width;
      if (s.x > this.width) s.x = 0;

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 240, 210, ${Math.max(0, s.alpha)})`;
      this.ctx.shadowColor = 'rgba(255, 235, 180, 0.8)';
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
    }

    // 2. Update and draw falling petals
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];

      p.swayOffset += 0.03;
      const sway = Math.sin(p.swayOffset) * 1.5;

      // Wind influence + mouse reaction
      let windX = this.wind.current + sway;
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const force = (1 - dist / 140) * 4;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      p.x += windX * p.speedX;
      p.y += p.speedY;
      p.angle += p.angularSpeed;
      p.flip += p.flipSpeed;

      this.drawPetal(p);

      // Recycle petals that flow out of bottom or right
      if (p.y > this.height + 40 || p.x > this.width + 120) {
        if (this.petals.length > this.maxPetals) {
          this.petals.splice(i, 1);
        } else {
          this.petals[i] = this.createPetal(false);
          this.petals[i].x = Math.random() * (this.width + 100) - 80;
        }
      }
    }

    // 3. Update and draw exploding hearts
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.vy += 0.12; // gravity
      h.vx *= 0.98;
      h.rot += h.rotSpeed;
      if (h.scale < h.targetScale) h.scale += 0.08;
      h.alpha -= h.decay;

      if (h.alpha <= 0 || h.y > this.height + 50) {
        this.hearts.splice(i, 1);
      } else {
        this.drawHeart(h);
      }
    }

    // 4. Update and draw celebration confetti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= 0.98;
      c.rot += c.rotSpeed;
      c.alpha -= 0.007;

      if (c.alpha <= 0 || c.y > this.height + 50) {
        this.confetti.splice(i, 1);
      } else {
        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate(c.rot);
        this.ctx.globalAlpha = Math.max(0, c.alpha);
        this.ctx.fillStyle = c.color;
        this.ctx.shadowColor = c.color;
        this.ctx.shadowBlur = 6;
        this.ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        this.ctx.restore();
      }
    }

    requestAnimationFrame(this.animate);
  }
}

window.SakuraEngine = SakuraEngine;
