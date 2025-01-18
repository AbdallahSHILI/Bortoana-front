import React from 'react'

const VoiceAnimation = () => {
  return (
    <div className="w-full h-52 flex items-center justify-center">
      <div className="relative w-48 h-48 rounded-full  overflow-hidden flex items-center justify-center">
        {/* Animated blurry circles */}
        <style>
          {`
            @keyframes float1 {
              0%, 100% { transform: translate(-20%, -20%); }
              50% { transform: translate(20%, 20%); }
            }
            @keyframes float2 {
              0%, 100% { transform: translate(20%, -20%); }
              50% { transform: translate(-20%, 20%); }
            }
            @keyframes float3 {
              0%, 100% { transform: translate(0%, 20%); }
              50% { transform: translate(0%, -20%); }
            }
            @keyframes wave {
              0%, 100% { height: 20px; }
              50% { height: 40px; }
            }
            .float1 { animation: float1 6s infinite ease-in-out; }
            .float2 { animation: float2 8s infinite ease-in-out; }
            .float3 { animation: float3 7s infinite ease-in-out; }
            .wave-bar { animation: wave 1s infinite ease-in-out; }
          `}
        </style>

        {/* Blurry background circles */}
        <div className="absolute w-24 h-24 rounded-full bg-blue-400 opacity-50 blur-xl float1" />
        <div className="absolute w-28 h-28 rounded-full bg-cyan-400 opacity-50 blur-xl float2" />
        <div className="absolute w-20 h-20 rounded-full bg-indigo-400 opacity-50 blur-xl float3" />

        {/* Voice bars */}
        <div className="relative z-10 flex space-x-1 h-10 items-center">
          {[0, 0.1, 0.2, 0.3, 0.4].map((delay, index) => (
            <div
              key={index}
              className="w-1.5 h-5 bg-gradient-to-b from-white to-blue-100 rounded-full wave-bar"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default VoiceAnimation
