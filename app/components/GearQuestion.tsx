"use client";

import * as React from "react";
import { a, useSpring } from "@react-spring/three";

export interface GearQuestionProps {
  onComplete: () => void; // Called when the user selects an option
}

export default function GearQuestion({ onComplete }: GearQuestionProps) {
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);

  // Smooth gear rotation using react-spring
  const { rotationY } = useSpring({
    rotationY: selectedOption !== null ? (selectedOption + 1) * (Math.PI / 2) : 0,
    config: { mass: 1, tension: 150, friction: 20 },
  });

  const options = [
    "Change people’s attitudes towards mental health (advocacy)",
    "Reducing stigma in schools (counselor education)",
    "Increase access to prescriptions and treatment",
    "Improve overall mental health and well-being",
  ];

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    // Call parent after short delay to move to next camera point
    setTimeout(() => onComplete(), 1000);
  };

  return (
    <>
      {/* 3D Gear */}
      <a.mesh position={[-1.2, 0.8, 0]} rotation={[0, rotationY, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color="orange" />
      </a.mesh>

      {/* Prompt overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 pointer-events-auto">
        <div className="bg-black p-6 rounded shadow-lg max-w-md">
          <p className="mb-4 font-semibold">What impact are you trying to leave?</p>
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className="block w-full mb-2 p-2 text-left bg-gray-200 hover:bg-gray-300 rounded"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
