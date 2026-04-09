'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

import { LoginForm } from '@/components/molecules/login-form';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get('email') || '';
  const justRegistered = searchParams.get('registered') === 'true';

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="bg-[#020817] font-body text-white antialiased min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Full-screen medical background */}
      <div className="fixed inset-0 z-0">
        <img
          alt="Advanced robotic surgery arm in sterile environment"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUseX8TJbyyaplrO-ja1tOnXo9x2PLfBLE9JkxPYnFPMvuFJlZvv7ULNm3UZrOq82798jVS5cL96AoOz_VfLo4UOPHKkMHOSKAsLLWLlmz_mOsbzYuCkPrGZp9QB0qQLgjKj3QVP1bR9oa-UH_Sy781_6HUQXXYFKgep_MqD2orL0KRHgVUQJbIDa_ToS0V12kcIKR-DffdWyzPTTR_LFyFMWTKSfLwOJ7CvXWyoBItJFpdk81-hbmty12dryKZjqVmUUrK8zKUKs"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, rgba(0,61,166,0.15) 0%, rgba(2,8,23,0.85) 100%)',
          }}
        />
      </div>

      {/* Centered content */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-6 py-12">
        <div className="w-full max-w-[480px]">
          {/* Brand identity */}
          <div className="mb-10 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="bg-primary p-4 rounded-2xl shadow-2xl shadow-primary/40 mb-2 border border-white/20">
                <span className="material-symbols-outlined text-white text-4xl align-middle">
                  medical_services
                </span>
              </div>
              <div>
                <span className="font-headline text-3xl font-extrabold tracking-tight text-white">
                  Clinical Curator
                </span>
                <div className="h-1 w-12 bg-primary mx-auto mt-2 rounded-full" />
              </div>
            </div>
          </div>

          {/* Login card */}
          <div
            className="rounded-[2rem] p-8 md:p-12 text-slate-900"
            style={{
              background: '#ffffff',
              boxShadow:
                '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            <div className="mb-8 text-center">
              <h1 className="font-headline text-2xl font-bold text-slate-900 tracking-tight">
                Portal Access
              </h1>
              <p className="text-slate-600 mt-2 text-sm font-medium">
                Please enter your credentials to continue
              </p>
            </div>

            {/* Registration success banner */}
            {justRegistered && (
              <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  />
                </svg>
                <p className="text-sm font-medium text-green-800">
                  Account created successfully! Sign in to access your portal.
                </p>
              </div>
            )}

            <LoginForm defaultEmail={prefillEmail} onSuccess={handleLoginSuccess} />

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-slate-400">info</span>
                Demo Credentials
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-700">
                  <span className="font-bold text-slate-500">Email:</span>{' '}
                  <span className="font-mono font-semibold text-primary">testuser@healthcare.com</span>
                </p>
                <p className="text-xs text-slate-700">
                  <span className="font-bold text-slate-500">Password:</span>{' '}
                  <span className="font-mono font-semibold text-primary">Test@123</span>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500 font-medium">
              New to Clinical Curator?{' '}
              <a
                href="/register"
                className="text-primary font-bold hover:text-primary-container transition-colors underline underline-offset-4 ml-1"
              >
                Create Account
              </a>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-primary text-base">verified_user</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                HIPAA Compliant
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-primary text-base">
                enhanced_encryption
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                AES-256 Encrypted
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-md border-t border-white/10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full px-8 py-10 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">medical_services</span>
              Clinical Curator
            </div>
            <p className="text-xs font-medium text-slate-400 max-w-sm leading-relaxed">
              Advanced health management systems providing secure, intuitive interfaces for the
              modern healthcare professional.
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              © 2024 Clinical Curator Health Systems.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              {['Support Desk', 'Network Status', 'Safety Protocols'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {['Legal Privacy', 'Compliance Hub'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020817]" />}>
      <LoginPageContent />
    </Suspense>
  );
}
