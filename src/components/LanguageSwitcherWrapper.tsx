"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the LanguageSwitcher component
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), { ssr: false });

interface LanguageSwitcherWrapperProps {
  currentLocale: string;
}

const LanguageSwitcherWrapper = ({ currentLocale }: LanguageSwitcherWrapperProps) => {
  return <LanguageSwitcher currentLocale={currentLocale} />;
};

export default LanguageSwitcherWrapper; 