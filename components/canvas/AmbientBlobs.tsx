'use client';

// Pure-CSS ambient glow blobs — no canvas, no JS, zero runtime cost.
// Two very slow-drifting blurred shapes give the "breathing darkness" feel.

interface Props {
  variant?: 'hero' | 'cta';
}

export default function AmbientBlobs({ variant = 'hero' }: Props) {
  if (variant === 'cta') {
    return (
      <>
        <style>{`
          @keyframes blobA-cta {
            0%,100% { transform: translate(0,0) scale(1); }
            50%      { transform: translate(-40px, 30px) scale(1.12); }
          }
          @keyframes blobB-cta {
            0%,100% { transform: translate(0,0) scale(1.05); }
            50%      { transform: translate(50px, -25px) scale(0.92); }
          }
        `}</style>
        <div aria-hidden style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{
            position:'absolute', width:500, height:500, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(238,236,232,0.055) 0%, transparent 70%)',
            filter:'blur(80px)',
            top:'10%', left:'20%',
            animation:'blobA-cta 18s ease-in-out infinite',
          }} />
          <div style={{
            position:'absolute', width:400, height:400, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(238,236,232,0.04) 0%, transparent 70%)',
            filter:'blur(90px)',
            bottom:'15%', right:'25%',
            animation:'blobB-cta 22s ease-in-out infinite',
          }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes blobA {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px,-40px) scale(1.08); }
          66%      { transform: translate(-30px, 50px) scale(0.96); }
        }
        @keyframes blobB {
          0%,100% { transform: translate(0,0) scale(1.04); }
          40%      { transform: translate(-50px, 30px) scale(0.94); }
          75%      { transform: translate(40px,-20px) scale(1.1); }
        }
        @keyframes blobC {
          0%,100% { transform: translate(0,0) scale(0.95); }
          50%      { transform: translate(30px, 60px) scale(1.05); }
        }
      `}</style>
      <div aria-hidden style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        {/* Top-right warmth */}
        <div style={{
          position:'absolute', width:700, height:700, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(238,236,232,0.048) 0%, transparent 65%)',
          filter:'blur(100px)',
          top:'-15%', right:'-10%',
          animation:'blobA 20s ease-in-out infinite',
        }} />
        {/* Bottom-left depth */}
        <div style={{
          position:'absolute', width:600, height:600, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(200,205,220,0.035) 0%, transparent 65%)',
          filter:'blur(120px)',
          bottom:'-10%', left:'-8%',
          animation:'blobB 26s ease-in-out infinite',
        }} />
        {/* Center-right atmosphere */}
        <div style={{
          position:'absolute', width:400, height:400, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(238,236,232,0.028) 0%, transparent 65%)',
          filter:'blur(80px)',
          top:'40%', right:'30%',
          animation:'blobC 16s ease-in-out infinite',
        }} />
      </div>
    </>
  );
}
