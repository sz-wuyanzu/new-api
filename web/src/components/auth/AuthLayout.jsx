/*
  Shared two-column auth layout:
  - Left: AnimatedCharactersPanel (hidden on mobile)
  - Right: form content (children)
  - Hides the global header for a clean full-screen experience
*/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedCharactersPanel from './AnimatedCharacters';
import { getLogo, getSystemName } from '../../helpers';

const AUTH_BODY_CLASS = 'auth-page-header-opaque';

const AuthLayout = ({ children }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  const logo = getLogo();
  const systemName = getSystemName();

  useEffect(() => {
    document.body.classList.add(AUTH_BODY_CLASS);
    return () => document.body.classList.remove(AUTH_BODY_CLASS);
  }, []);

  return (
    <div className='fixed inset-0 grid lg:grid-cols-2' style={{ zIndex: 100 }}>
      {/* Left: animated characters */}
      <AnimatedCharactersPanel
        isTyping={isTyping}
        showPassword={showPassword}
        hasPassword={hasPassword}
        systemName={systemName}
        logo={logo}
      />

      {/* Right: form */}
      <div className='auth-right-panel relative flex flex-col overflow-hidden'>
        {/* Decorative blurred orbs for liquid/glass feel */}
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
            {typeof children === 'function'
              ? children({ isTyping, setIsTyping, showPassword, setShowPassword, hasPassword, setHasPassword })
              : children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
