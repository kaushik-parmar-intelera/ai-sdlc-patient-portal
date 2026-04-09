'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { RegistrationForm } from '@/components/molecules/registration-form';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegistrationSuccess = (_userId: string, email: string) => {
    router.push('/login?email=' + encodeURIComponent(email) + '&registered=true');
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Brand Panel — hidden on mobile */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-primary overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Modern bright medical research laboratory with soft blue ambient lighting"
            className="w-full h-full object-cover opacity-60"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6paoxrGq9WvMPOYnxTxgqv9CYBALFeI47TCxe6w3Pdd2awHkASMjsHw0BCNwk9cNE_XqglIfDOttwKCCd3vN7wk75P3-blkmtB63Z_nzvlSy-PdHBRRpe-0DrZwJLvJO0DDOfrGaQ1Oq2leQQA6jv0b34VgfwpMZnrAfv0CWEeqZzsinGKVCvxRm76DINubuiNXI5Ol9AXV8d_BrBr0JeKqFIXY_a9amp3E8xikS5rkNVvHa1Nw592CSYf5iHRwV2G_iG6BS3X2I"
          />
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-80"
          style={{ background: 'linear-gradient(135deg, #002976 0%, #003da6 100%)' }}
        />
        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 lg:p-20">
          <div>
            <h1 className="font-headline font-extrabold text-4xl lg:text-6xl text-white tracking-tight leading-tight">
              Clinical Curator
            </h1>
            <p className="mt-6 text-xl text-on-primary-container font-medium max-w-md">
              The precision of medicine, the warmth of wellness. Join a network designed for editorial health excellence.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">verified_user</span>
              </div>
              <div>
                <h3 className="text-white font-headline font-bold text-lg">Secure Identity</h3>
                <p className="text-on-primary-container text-sm">
                  Your medical records are protected by military-grade encryption and curated access.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">medical_services</span>
              </div>
              <div>
                <h3 className="text-white font-headline font-bold text-lg">Integrated Care</h3>
                <p className="text-on-primary-container text-sm">
                  Seamless connectivity between your specialists, pharmacy, and primary care team.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-10">
            <p className="text-white/60 text-xs font-label tracking-widest uppercase">
              Member Network © 2024
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-surface items-center">
        <div className="w-full max-w-2xl px-6 py-12 md:py-20 lg:px-16">
          {/* Mobile brand header */}
          <div className="md:hidden mb-8">
            <h1 className="font-headline font-extrabold text-2xl text-primary tracking-tight">
              Clinical Curator
            </h1>
          </div>

          <header className="mb-12">
            <h2 className="font-headline font-extrabold text-3xl text-on-background tracking-tight">
              Create your patient profile
            </h2>
            <p className="mt-2 text-on-surface-variant">
              Already a member?{' '}
              <a
                className="text-primary font-bold hover:underline decoration-2 underline-offset-4"
                href="/login"
              >
                Sign in to Patient Portal
              </a>
            </p>
          </header>

          <RegistrationForm onSuccess={handleRegistrationSuccess} />

          <footer className="mt-16 pt-8 border-t border-surface-container-highest flex flex-col md:flex-row justify-between gap-6">
            <p className="text-xs font-medium text-slate-500">
              © 2024 Clinical Curator Health Systems.
            </p>
            <div className="flex gap-4">
              <a className="text-xs font-medium text-slate-500 hover:text-primary transition-colors" href="#">
                Emergency: 911
              </a>
              <a className="text-xs font-medium text-slate-500 hover:text-primary transition-colors" href="#">
                Find a Clinic
              </a>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
