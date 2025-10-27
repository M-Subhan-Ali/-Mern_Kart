"use client"

import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackgroundComponent = () => {
  const [init, setInit] = useState(false);

  // Initialize engine once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container?: any) => {
    console.log("Particles Loaded:", container);
  };

  const options = useMemo(
    () => ({
      fpsLimit: 40,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 130, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#e9d207ff" },
        links: {
          color: "#13ace9ff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1.5,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: 3,
          straight: false,
        },
        number: {
          density: { enable: true, area: 1080 },
          value: 550,
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1,
          },
        },
        shape: { type: "circle" },
        size: { value: { min: 0.5, max: 1 }, random: { enable: true } },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {init && (
        <Particles
          id="tsparticles"
          options={options}
          particlesLoaded={particlesLoaded}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
};

// ✅ Wrap in React.memo so it won’t remount on every Products re-render
const ParticlesBackground = React.memo(ParticlesBackgroundComponent);
ParticlesBackground.displayName = "ParticlesBackground";

export default ParticlesBackground;
