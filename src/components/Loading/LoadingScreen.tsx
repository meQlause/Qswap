import React, { useEffect, useRef } from 'react';

const LoadingScreen: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasSize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        class Hexagon {
            x: number;
            y: number;
            size: number;
            angle: number;
            rotationSpeed: number;
            opacity: number;
            pulseDirection: number;
            gradient: string;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 20 + 10;
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.pulseDirection = 1;
                // Randomly choose between two gradients
                this.gradient = Math.random() > 0.5 ? '#191b1f' : '#212429';
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 * i) / 6;
                    const x = Math.cos(angle) * this.size;
                    const y = Math.sin(angle) * this.size;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = `rgba(33, 36, 41, ${this.opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }

            update() {
                this.angle += this.rotationSpeed;
                this.opacity += 0.02 * this.pulseDirection;
                if (this.opacity >= 0.6) this.pulseDirection = -1;
                if (this.opacity <= 0.1) this.pulseDirection = 1;
            }
        }

        const hexagons: Hexagon[] = [];
        const hexagonCount = 15;

        for (let i = 0; i < hexagonCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            hexagons.push(new Hexagon(x, y));
        }

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.fillStyle = 'rgba(25, 27, 31, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            hexagons.forEach(hexagon => {
                hexagon.update();
                hexagon.draw();
            });

            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#191b1f] to-[#212429] flex items-center justify-center z-50 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
            />
            <div className="relative z-10 text-center">
                <h2 className="mt-8 text-3xl font-bold bg-gradient-to-b from-[#191b1f] to-[#212429] bg-clip-text text-transparent">
                    Loading
                </h2>
                <div className="mt-4 flex space-x-2 justify-center">
                    <div className="w-3 h-3 bg-[#191b1f] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-[#212429] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-[#191b1f] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen; 