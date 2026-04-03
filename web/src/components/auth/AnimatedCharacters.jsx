/*
  Animated Characters Panel for Login/Register/Reset pages.
  Inspired by aghasisahakyan1's "Animated Characters Login Page" on 21st.dev.
  Adapted from Next.js/shadcn to React/Semi Design for this project.
*/
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ── Grid overlay ── */
const GridOverlay = () => (
  <div className='absolute inset-0 overflow-hidden opacity-[0.07]' style={{ zIndex: 0 }}>
    <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='auth-grid' width='60' height='60' patternUnits='userSpaceOnUse'>
          <path d='M 60 0 L 0 0 0 60' fill='none' stroke='white' strokeWidth='0.5' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#auth-grid)' />
    </svg>
  </div>
);

/* ── Floating orb ── */
const FloatingOrb = ({ size, color, top, left, delay = 0, blur = 60 }) => (
  <div
    className='absolute rounded-full'
    style={{
      width: size, height: size, background: color, top, left,
      filter: `blur(${blur}px)`, opacity: 0.45,
      animation: `authFloatOrb ${8 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`, zIndex: 0,
    }}
  />
);

/* ── Mouse-following spotlight ── */
const Spotlight = () => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setPos({
        x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return (
    <div ref={ref} className='absolute inset-0' style={{
      background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.06), transparent 60%)`,
      transition: 'background 0.3s ease-out', zIndex: 1,
    }} />
  );
};

/* ── Pupil (no white eyeball, just a dot) ── */
const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = '#2D2D2D',
  forceLookX,
  forceLookY,
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  const pos = (() => {
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    if (!ref.current) return { x: 0, y: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  })();

  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

/* ── EyeBall (white circle + pupil inside) ── */
const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = 'white',
  pupilColor = '#2D2D2D',
  isBlinking = false,
  forceLookX,
  forceLookY,
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  const pos = (() => {
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    if (!ref.current) return { x: 0, y: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  })();

  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: isBlinking ? 2 : size,
        borderRadius: '50%',
        backgroundColor: eyeColor,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      {!isBlinking && (
        <div
          style={{
            width: pupilSize,
            height: pupilSize,
            borderRadius: '50%',
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

/* ── useRandomBlink hook ── */
function useRandomBlink() {
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    let timeout;
    const schedule = () => {
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 150);
      }, Math.random() * 4000 + 3000);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);
  return blinking;
}

/**
 * AnimatedCharactersPanel
 *
 * Props:
 *  - isTyping: boolean        — user is focused on an input
 *  - showPassword: boolean    — password is visible
 *  - hasPassword: boolean     — password field has content
 *  - systemName: string       — brand name to show
 *  - logo: string             — logo URL
 */
const AnimatedCharactersPanel = ({
  isTyping = false,
  showPassword = false,
  hasPassword = false,
  systemName = '',
  logo = '',
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  const isPurpleBlinking = useRandomBlink();
  const isBlackBlinking = useRandomBlink();

  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  // Characters look at each other when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    }
    setIsLookingAtEachOther(false);
  }, [isTyping]);

  // Purple sneaky peek when password is visible
  useEffect(() => {
    if (hasPassword && showPassword) {
      const t = setTimeout(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
      return () => clearTimeout(t);
    }
    setIsPurplePeeking(false);
  }, [hasPassword, showPassword, isPurplePeeking]);

  const calcPos = useCallback(
    (ref) => {
      if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 3;
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      return {
        faceX: Math.max(-15, Math.min(15, dx / 20)),
        faceY: Math.max(-10, Math.min(10, dy / 30)),
        bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
      };
    },
    [mouse],
  );

  const pp = calcPos(purpleRef);
  const bp = calcPos(blackRef);
  const yp = calcPos(yellowRef);
  const op = calcPos(orangeRef);

  const hiding = hasPassword && !showPassword;
  const peeking = hasPassword && showPassword;

  return (
    <div
      className='relative hidden lg:flex flex-col justify-between'
      style={{
        background: 'linear-gradient(145deg, #0a0a1a 0%, #0d1b3e 40%, #1a0a2e 70%, #0a0a1a 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Decorative layers */}
      <GridOverlay />
      <Spotlight />
      <FloatingOrb size={280} color='rgba(99,102,241,0.25)' top='5%' left='55%' delay={0} blur={80} />
      <FloatingOrb size={180} color='rgba(139,92,246,0.2)' top='60%' left='10%' delay={2} blur={70} />
      <FloatingOrb size={120} color='rgba(59,130,246,0.15)' top='80%' left='65%' delay={4} blur={60} />

      {/* Top spacer */}
      <div className='relative z-20' style={{ minHeight: 48 }} />

      {/* Brand section */}
      <div className='relative z-20 flex flex-col items-center px-12'>
        {/* Logo icon */}
        <div className='mb-5'>
          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center'
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 30px rgba(99,102,241,0.15)',
            }}
          >
            {logo ? (
              <img src={logo} alt='Logo' className='w-8 h-8 rounded-lg' />
            ) : (
              <svg width='28' height='28' viewBox='0 0 24 24' fill='none'>
                <path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z' stroke='url(#bolt-g)' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                <defs><linearGradient id='bolt-g' x1='3' y1='2' x2='22' y2='22'><stop stopColor='#818cf8' /><stop offset='1' stopColor='#c084fc' /></linearGradient></defs>
              </svg>
            )}
          </div>
        </div>
        {/* Title */}
        <h2
          className='text-2xl font-bold mb-2 text-center'
          style={{
            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 30%, #a5b4fc 60%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.01em',
          }}
        >
          {systemName || 'AI Gateway'}
        </h2>
        {/* Subtitle */}
        <p className='text-center text-sm leading-relaxed max-w-xs' style={{ color: 'rgba(203,213,225,0.6)' }}>
          Unified API access to the world's leading AI models.
          <br />Fast, reliable, and secure.
        </p>
        {/* Feature pills */}
        <div className='flex flex-wrap justify-center gap-2 mt-5'>
          {['40+ Providers', 'OpenAI Compatible', 'Real-time Billing', 'Auto Failover'].map((label) => (
            <span key={label} className='px-3 py-1 rounded-full text-xs' style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(203,213,225,0.5)',
            }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Characters */}
      <div className='relative z-20 flex items-end justify-center' style={{ height: 380 }}>
        <div className='relative' style={{ width: 550, height: 400 }}>
          {/* Purple character */}
          <div
            ref={purpleRef}
            className='absolute bottom-0'
            style={{
              left: 70,
              width: 180,
              height: isTyping || hiding ? 440 : 400,
              backgroundColor: '#6C3FF5',
              borderRadius: '10px 10px 0 0',
              zIndex: 1,
              transform: peeking
                ? 'skewX(0deg)'
                : isTyping || hiding
                  ? `skewX(${(pp.bodySkew || 0) - 12}deg) translateX(40px)`
                  : `skewX(${pp.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
              transition: 'all 0.7s ease-in-out',
            }}
          >
            <div
              className='absolute flex gap-8'
              style={{
                left: peeking ? 20 : isLookingAtEachOther ? 55 : 45 + pp.faceX,
                top: peeking ? 35 : isLookingAtEachOther ? 65 : 40 + pp.faceY,
                transition: 'all 0.7s ease-in-out',
              }}
            >
              <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking}
                forceLookX={peeking ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                forceLookY={peeking ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
              />
              <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking}
                forceLookX={peeking ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                forceLookY={peeking ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
              />
            </div>
          </div>

          {/* Black character */}
          <div
            ref={blackRef}
            className='absolute bottom-0'
            style={{
              left: 240,
              width: 120,
              height: 310,
              backgroundColor: '#2D2D2D',
              borderRadius: '8px 8px 0 0',
              zIndex: 2,
              transform: peeking
                ? 'skewX(0deg)'
                : isLookingAtEachOther
                  ? `skewX(${(bp.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                  : isTyping || hiding
                    ? `skewX(${(bp.bodySkew || 0) * 1.5}deg)`
                    : `skewX(${bp.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
              transition: 'all 0.7s ease-in-out',
            }}
          >
            <div
              className='absolute flex gap-6'
              style={{
                left: peeking ? 10 : isLookingAtEachOther ? 32 : 26 + bp.faceX,
                top: peeking ? 28 : isLookingAtEachOther ? 12 : 32 + bp.faceY,
                transition: 'all 0.7s ease-in-out',
              }}
            >
              <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking}
                forceLookX={peeking ? -4 : isLookingAtEachOther ? 0 : undefined}
                forceLookY={peeking ? -4 : isLookingAtEachOther ? -4 : undefined}
              />
              <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking}
                forceLookX={peeking ? -4 : isLookingAtEachOther ? 0 : undefined}
                forceLookY={peeking ? -4 : isLookingAtEachOther ? -4 : undefined}
              />
            </div>
          </div>

          {/* Orange character */}
          <div
            ref={orangeRef}
            className='absolute bottom-0'
            style={{
              left: 0,
              width: 240,
              height: 200,
              backgroundColor: '#FF9B6B',
              borderRadius: '120px 120px 0 0',
              zIndex: 3,
              transform: peeking ? 'skewX(0deg)' : `skewX(${op.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
              transition: 'all 0.7s ease-in-out',
            }}
          >
            <div
              className='absolute flex gap-8'
              style={{
                left: peeking ? 50 : 82 + (op.faceX || 0),
                top: peeking ? 85 : 90 + (op.faceY || 0),
                transition: 'all 0.2s ease-out',
              }}
            >
              <Pupil size={12} maxDistance={5} forceLookX={peeking ? -5 : undefined} forceLookY={peeking ? -4 : undefined} />
              <Pupil size={12} maxDistance={5} forceLookX={peeking ? -5 : undefined} forceLookY={peeking ? -4 : undefined} />
            </div>
          </div>

          {/* Yellow character */}
          <div
            ref={yellowRef}
            className='absolute bottom-0'
            style={{
              left: 310,
              width: 140,
              height: 230,
              backgroundColor: '#E8D754',
              borderRadius: '70px 70px 0 0',
              zIndex: 4,
              transform: peeking ? 'skewX(0deg)' : `skewX(${yp.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
              transition: 'all 0.7s ease-in-out',
            }}
          >
            <div
              className='absolute flex gap-6'
              style={{
                left: peeking ? 20 : 52 + (yp.faceX || 0),
                top: peeking ? 35 : 40 + (yp.faceY || 0),
                transition: 'all 0.2s ease-out',
              }}
            >
              <Pupil size={12} maxDistance={5} forceLookX={peeking ? -5 : undefined} forceLookY={peeking ? -4 : undefined} />
              <Pupil size={12} maxDistance={5} forceLookX={peeking ? -5 : undefined} forceLookY={peeking ? -4 : undefined} />
            </div>
            {/* Mouth */}
            <div
              className='absolute rounded-full'
              style={{
                width: 80,
                height: 4,
                backgroundColor: '#2D2D2D',
                left: peeking ? 10 : 40 + (yp.faceX || 0),
                top: peeking ? 88 : 88 + (yp.faceY || 0),
                transition: 'all 0.2s ease-out',
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className='relative z-20 flex items-center gap-8 text-sm px-12 pb-8' style={{ color: 'rgba(203,213,225,0.3)' }}>
        <a href='/privacy-policy' className='hover:text-white/60 transition-colors'>Privacy Policy</a>
        <a href='/user-agreement' className='hover:text-white/60 transition-colors'>Terms of Service</a>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes authFloatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedCharactersPanel;
