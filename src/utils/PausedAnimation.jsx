import React from 'react'

const PausedAnimation = () => {
  return (
    <div className="w-full h-52 flex items-center justify-center">
      <div className="relative w-48 h-48 rounded-full  overflow-hidden flex items-center justify-center">
        {/* Animated blurry circles with slower/different animations for paused state */}
        <style>
          {`
            @keyframes pausedFloat1 {
              0%, 100% { transform: translate(-10%, -10%) scale(1.1); opacity: 0.3; }
              50% { transform: translate(10%, 10%) scale(0.9); opacity: 0.5; }
            }
            @keyframes pausedFloat2 {
              0%, 100% { transform: translate(10%, -10%) scale(0.9); opacity: 0.5; }
              50% { transform: translate(-10%, 10%) scale(1.1); opacity: 0.3; }
            }
            @keyframes pausedFloat3 {
              0%, 100% { transform: translate(0%, 10%) scale(1); opacity: 0.4; }
              50% { transform: translate(0%, -10%) scale(1.2); opacity: 0.2; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(0.95); opacity: 1; }
            }
            .paused-float1 { animation: pausedFloat1 8s infinite ease-in-out; }
            .paused-float2 { animation: pausedFloat2 10s infinite ease-in-out; }
            .paused-float3 { animation: pausedFloat3 9s infinite ease-in-out; }
            .pause-bar { animation: pulse 2s infinite ease-in-out; }
          `}
        </style>

        {/* Background circles with slower animations */}
        <div className="absolute w-24 h-24 rounded-full bg-blue-400/30 blur-xl paused-float1" />
        <div className="absolute w-28 h-28 rounded-full bg-cyan-400/30 blur-xl paused-float2" />
        <div className="absolute w-20 h-20 rounded-full bg-indigo-400/30 blur-xl paused-float3" />

        {/* Pause symbol */}
        <div className="relative z-10 flex space-x-3">
          <div className="w-3 h-12 bg-white/90 rounded-full pause-bar" />
          <div className="w-3 h-12 bg-white/90 rounded-full pause-bar" />
        </div>
      </div>
    </div>
  )
}

export default PausedAnimation
