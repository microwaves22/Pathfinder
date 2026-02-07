"use client";


import { useState, useEffect, useRef } from "react";

const blipSounds = ["/animal-crossing-audio1.mp3", "/animal-crossing-audio2.mp3"];

// Music track: Moving Mountains by Aeris
// Source: https://freetouse.com/music
// No Copyright Vlog Music for Video
const ambientMusicPath = "/Aeris - Moving Mountains (freetouse.com).mp3";

const dialogueData = [
  {
    speaker: "Therapist",
    text: "You sit across from Bob, noticing his tense posture, downcast eyes, and hesitant voice.",
  },
  {
    speaker: "Prompt",
    text: "Choose your body language and tone:",
    options: [
      "Soften your tone; speak slowly and calmly.",
      "Lean forward slightly to show attentiveness.",
      "Keep hands open and visible on the desk to convey openness.",
      "Nod occasionally to signal understanding without interrupting.",
      "Maintain gentle eye contact without staring—allow Bob to look away if needed.",
    ],
  },
  {
    speaker: "Therapist",
    text: "How would you begin the session?",
    options: [
      "Acknowledge the difficulty of coming in",
      "Normalize his feelings",
      "Set a safe, nonjudgmental tone",
    ],
  },
  {
    speaker: "Bob",
    text: "“I… I don’t really know why I feel like this. My family thinks I’m just being lazy, and people say I should just ‘get over it.’”",
  },
  {
    speaker: "Prompt",
    text: "What should you say to bring down Bob’s barriers?",
    options: [
      "Validate and empathize",
      "Normalize cultural stigma but reinforce safety",
      "Encourage pacing and choice",
      "Use an open-ended question to invite sharing",
    ],
  },
];

export default function Interaction() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const blipIndexRef = useRef(0); // keep track of which blip to play

  useEffect(() => {
    // Play ambient music
    const ambientAudio = new Audio(ambientMusicPath);
    ambientAudio.loop = true;
    ambientAudio.play().catch(() => {
      console.log("Autoplay blocked. Click to start music.");
    });
    ambientAudioRef.current = ambientAudio;

    return () => {
      ambientAudio.pause();
    };
  }, []);

  const typeText = (text: string, speed = 30) => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text[i]);

        // Play alternating blip sound
        const blipAudio = new Audio(blipSounds[blipIndexRef.current]);
        blipAudio.currentTime = 0;
        blipAudio.play();

        // Switch to the other blip
        blipIndexRef.current = (blipIndexRef.current + 1) % blipSounds.length;

        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
  };

  const handleNext = (option?: string) => {
    // play blip when user clicks an option
    if (option) {
      const blipAudio = new Audio(blipSounds[blipIndexRef.current]);
      blipAudio.currentTime = 0;
      blipAudio.play();
      blipIndexRef.current = (blipIndexRef.current + 1) % blipSounds.length;
    }

    if (currentIndex < dialogueData.length) {
      const item = dialogueData[currentIndex];
      typeText(item.text);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const currentItem = dialogueData[currentIndex] || null;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "sans-serif",
        border: "2px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f0f0f0",
      }}
    >
      <p style={{ minHeight: "60px", fontSize: "18px" }}>{displayedText}</p>

      {/* Display options if current item has them */}
      {currentItem?.options && !isTyping && (
        <div style={{ marginTop: "10px" }}>
          {currentItem.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleNext(opt)}
              style={{
                display: "block",
                margin: "5px 0",
                padding: "10px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Next button if no options */}
      {!currentItem?.options && !isTyping && currentIndex < dialogueData.length && (
        <button
          onClick={() => handleNext()}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Next
        </button>
      )}
    </div>
  );
}