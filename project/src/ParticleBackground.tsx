import React, { useRef, useEffect } from "react";
import p5 from "p5";

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5 | null = null;

    const sketch = (p: p5) => {
      let particles: { pos: p5.Vector; vel: p5.Vector }[] = []; // Fixed type
      const numParticles = 100;
      const maxDistance = 120;
      let mousePos: p5.Vector | null = null;

      p.setup = () => {
        if (canvasRef.current) {
          p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight).parent(canvasRef.current);
        }
        for (let i = 0; i < numParticles; i++) {
          particles.push({
            pos: p.createVector(p.random(p.width), p.random(p.height)),
            vel: p.createVector(p.random(-1, 1), p.random(-1, 1)),
          });
        }
      };

      p.draw = () => {
        p.clear();
        for (let i = 0; i < particles.length; i++) {
          let particle = particles[i];
          particle.pos.add(particle.vel);

          // Bounce off walls
          if (particle.pos.x > p.width || particle.pos.x < 0) particle.vel.x *= -1;
          if (particle.pos.y > p.height || particle.pos.y < 0) particle.vel.y *= -1;

          p.fill(255, 204, 0);
          p.noStroke();
          p.ellipse(particle.pos.x, particle.pos.y, 4);

          // Draw lines between close particles
          for (let j = i + 1; j < particles.length; j++) {
            let other = particles[j];
            let d = p.dist(particle.pos.x, particle.pos.y, other.pos.x, other.pos.y);
            if (d < maxDistance) {
              p.stroke(255, 204, 0, p.map(d, 0, maxDistance, 255, 0));
              p.line(particle.pos.x, particle.pos.y, other.pos.x, other.pos.y);
            }
          }
        }

        // Cursor interaction
        if (mousePos) {
          p.fill(255, 204, 0);
          p.noStroke();
          p.ellipse(mousePos.x, mousePos.y, 8);

          for (let i = 0; i < particles.length; i++) {
            let d = p.dist(mousePos.x, mousePos.y, particles[i].pos.x, particles[i].pos.y);
            if (d < maxDistance) {
              p.stroke(255, 204, 0, p.map(d, 0, maxDistance, 255, 0));
              p.line(mousePos.x, mousePos.y, particles[i].pos.x, particles[i].pos.y);
            }
          }
        }
      };

      p.mouseMoved = () => {
        mousePos = p.createVector(p.mouseX, p.mouseY);
      };
      
      p.mouseOut = () => {
        mousePos = null;
      };

      p.windowResized = () => {
        p.resizeCanvas(canvasRef.current?.offsetWidth || 0, canvasRef.current?.offsetHeight || 0);
      };
    };

    if (canvasRef.current) {
      p5Instance = new p5(sketch, canvasRef.current);
    }

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, []);

  return <div ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10"></div>;
};

export default ParticleBackground;
