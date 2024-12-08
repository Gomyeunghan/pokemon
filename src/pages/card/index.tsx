import { korean } from "@/types/korean";
import { Pokemon } from "@/types/pokemon";
import S from "./index.module.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function Card({
  poke,
  koreanData,
}: {
  poke: Pokemon;
  koreanData: korean;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / 120;
      const y = (event.clientY - rect.top - rect.height / 2) / 120;

      setMousePosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };
  return (
    <div key={poke?.id} className={S.container}>
      <motion.div
        className={S.motion}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: mousePosition.x * 10,
          rotateY: mousePosition.y * -10,
          rotateZ: 0,
          transition: {
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 0.5,
          },
        }}
        style={{
          boxShadow: `
            ${-mousePosition.x * 30}px ${
            -mousePosition.y * 30
          }px 40px rgba(0,0,0,0.1),
            ${mousePosition.x * 30}px ${
            mousePosition.y * 30
          }px 40px rgba(255,255,255,1)
          `,
        }}
        whileHover={{
          scale: 1.07,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 25,
          },
        }}
      >
        <Link href={`pokemon/${poke?.id}`} className={S.link}>
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: "100",

              backgroundImage: `
          radial-gradient(
            circle at ${50 + mousePosition.x * 30}% ${
                50 + mousePosition.y * 30
              }%, 
           #00000010,#ffffff10,#ffffff70
          )
        `,
            }}
          ></div>
          <img src={poke?.sprites.front_default}></img>
        </Link>
      </motion.div>

      <span className={S.name}>
        {koreanData ? koreanData.names[2].name : "로딩중"}
      </span>
    </div>
  );
}
