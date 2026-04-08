/*
  Auth layout route wrapper — keeps the left animated panel mounted
  while React Router swaps only the right-side form via <Outlet />.
  This prevents a full re-mount when navigating between /login, /register, /reset.
*/
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedCharactersPanel from './AnimatedCharacters';
import { Link } from 'react-router-dom';
import { getLogo, getSystemName } from '../../helpers';

const AUTH_BODY_CLASS = 'auth-page-header-opaque';

// Context so child forms can control the animation state
export const AuthAnimationContext = createContext({
  isTyping: false,
  setIsTyping: () => {},
  showPassword: false,
  setShowPassword: () => {},
  hasPassword: false,
  setHasPassword: () => {},
});

export const useAuthAnimation = () => useContext(AuthAnimationContext);

const AuthLayoutRoute = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  const logo = getLogo();
  const systemName = getSystemName();

  useEffect(() => {
    document.body.classList.add(AUTH_BODY_CLASS);
    return () => document.body.classList.remove(AUTH_BODY_CLASS);
  }, []);

  // Reset animation state when the route changes (login <-> register)
  // The child form will set the correct state on mount/interaction

  return (
    <AuthAnimationContext.Provider value={{
      isTyping, setIsTyping,
      showPassword, setShowPassword,
      hasPassword, setHasPassword,
    }}>
      <div className='fixed inset-0 grid lg:grid-cols-2' style={{ zIndex: 100 }}>
        {/* Left: animated characters — stays mounted across route changes */}
        <AnimatedCharactersPanel
          isTyping={isTyping}
          showPassword={showPassword}
          hasPassword={hasPassword}
          systemName={systemName}
          logo={logo}
        />

        {/* Right: form — swapped by React Router */}
        <div className='auth-right-panel relative flex flex-col overflow-hidden'>
          {/* Decorative blurred orbs */}
          <div className='absolute top-[-10%] right-[-15%] w-80 h-80 rounded-full opacity-20' style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)',
            filter: 'blur(60px)',
          }} />
          <div className='absolute bottom-[-10%] left-[-10%] w-72 h-72 rounded-full opacity-15' style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)',
            filter: 'blur(50px)',
          }} />
          <div className='absolute top-[40%] left-[60%] w-48 h-48 rounded-full opacity-10' style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)',
            filter: 'blur(40px)',
          }} />

          {/* Mini top bar with logo */}
          <div className='relative z-10 flex items-center justify-between px-8 pt-6 pb-2'>
            <Link to='/' className='flex items-center gap-2 no-underline'>
              {logo && <img src={logo} alt='Logo' className='h-7 rounded-full' />}
              <span className='text-sm font-semibold tracking-tight' style={{ color: 'var(--semi-color-text-0)' }}>
                {systemName}
              </span>
            </Link>
          </div>

          <div className='relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 pb-8 overflow-y-auto'>
            <div className='w-full max-w-sm'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </AuthAnimationContext.Provider>
  );
};

export default AuthLayoutRoute;
