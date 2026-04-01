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
      <div className='flex flex-col bg-[var(--semi-color-bg-0)] overflow-y-auto'>
        {/* Mini top bar with logo */}
        <div className='flex items-center justify-between px-8 pt-6 pb-2'>
          <Link to='/' className='flex items-center gap-2 no-underline'>
            {logo && <img src={logo} alt='Logo' className='h-8 rounded-full' />}
            <span className='text-base font-semibold' style={{ color: 'var(--semi-color-text-0)' }}>
              {systemName}
            </span>
          </Link>
        </div>

        <div className='flex-1 flex items-center justify-center px-8 pb-8'>
          <div className='w-full max-w-md'>
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
