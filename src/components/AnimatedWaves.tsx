import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedWaves = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const waveOffset1 = useTransform(springX, [0, window.innerWidth], [-10, 10]);
  const waveOffset2 = useTransform(springY, [0, window.innerHeight], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 99%) 0%, hsl(185 40% 96%) 50%, hsl(185 50% 90%) 100%)'
        }}
      />
      
      {/* Wave layers */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[60vh]"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back wave - lightest */}
        <motion.path
          d="M0,400 C180,350 360,450 540,400 C720,350 900,450 1080,400 C1260,350 1350,400 1440,380 L1440,600 L0,600 Z"
          fill="hsl(185 55% 75% / 0.4)"
          style={{ x: waveOffset1 }}
          animate={{
            d: [
              "M0,400 C180,350 360,450 540,400 C720,350 900,450 1080,400 C1260,350 1350,400 1440,380 L1440,600 L0,600 Z",
              "M0,380 C180,430 360,380 540,430 C720,380 900,430 1080,380 C1260,430 1350,380 1440,400 L1440,600 L0,600 Z",
              "M0,400 C180,350 360,450 540,400 C720,350 900,450 1080,400 C1260,350 1350,400 1440,380 L1440,600 L0,600 Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Middle wave */}
        <motion.path
          d="M0,450 C240,400 480,500 720,450 C960,400 1200,500 1440,450 L1440,600 L0,600 Z"
          fill="hsl(185 55% 60% / 0.5)"
          style={{ x: waveOffset2, y: waveOffset1 }}
          animate={{
            d: [
              "M0,450 C240,400 480,500 720,450 C960,400 1200,500 1440,450 L1440,600 L0,600 Z",
              "M0,470 C240,520 480,420 720,470 C960,520 1200,420 1440,470 L1440,600 L0,600 Z",
              "M0,450 C240,400 480,500 720,450 C960,400 1200,500 1440,450 L1440,600 L0,600 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Front wave - darkest */}
        <motion.path
          d="M0,500 C200,470 400,530 600,500 C800,470 1000,530 1200,500 C1320,480 1380,510 1440,490 L1440,600 L0,600 Z"
          fill="hsl(185 55% 45% / 0.7)"
          style={{ x: waveOffset1, y: waveOffset2 }}
          animate={{
            d: [
              "M0,500 C200,470 400,530 600,500 C800,470 1000,530 1200,500 C1320,480 1380,510 1440,490 L1440,600 L0,600 Z",
              "M0,490 C200,520 400,480 600,510 C800,540 1000,480 1200,510 C1320,530 1380,490 1440,510 L1440,600 L0,600 Z",
              "M0,500 C200,470 400,530 600,500 C800,470 1000,530 1200,500 C1320,480 1380,510 1440,490 L1440,600 L0,600 Z",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Foam/highlight wave */}
        <motion.path
          d="M0,520 C150,510 300,540 450,520 C600,500 750,540 900,520 C1050,500 1200,540 1350,520 C1400,515 1420,525 1440,520 L1440,600 L0,600 Z"
          fill="hsl(0 0% 100% / 0.3)"
          animate={{
            d: [
              "M0,520 C150,510 300,540 450,520 C600,500 750,540 900,520 C1050,500 1200,540 1350,520 C1400,515 1420,525 1440,520 L1440,600 L0,600 Z",
              "M0,530 C150,540 300,520 450,530 C600,540 750,520 900,530 C1050,540 1200,520 1350,530 C1400,535 1420,525 1440,530 L1440,600 L0,600 Z",
              "M0,520 C150,510 300,540 450,520 C600,500 750,540 900,520 C1050,500 1200,540 1350,520 C1400,515 1420,525 1440,520 L1440,600 L0,600 Z",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </svg>

      {/* Decorative circles */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full opacity-20"
        style={{ background: 'hsl(4 60% 75%)' }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 left-10 w-20 h-20 rounded-full opacity-15"
        style={{ background: 'hsl(45 80% 60%)' }}
        animate={{
          scale: [1, 1.2, 1],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedWaves;
