"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the AuthBtn component to avoid server-side rendering
const AuthBtn = dynamic(() => import('./AuthBtn'), { ssr: false });

interface AuthBtnWrapperProps {
  locale: string;
}

const AuthBtnWrapper = ({ locale }: AuthBtnWrapperProps) => {
  return <AuthBtn locale={locale} />;
};

export default AuthBtnWrapper; 