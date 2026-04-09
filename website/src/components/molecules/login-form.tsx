'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuthSessionStore } from '@/store/auth-session.store';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  defaultEmail?: string;
  onSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  defaultEmail = '',
  onSuccess,
  className = '',
}) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: defaultEmail, password: '' },
  });

  React.useEffect(() => {
    if (!defaultEmail) setFocus('email');
    else setFocus('password');
  }, [defaultEmail, setFocus]);

  const onSubmit = useCallback(
    async (data: LoginInput) => {
      setFormError(null);
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const body = await response.json().catch(() => ({}));
          useAuthSessionStore.getState().setAuthenticated({
            userId: body.user?.email ?? data.email,
            name: body.user?.name ?? '',
            email: body.user?.email ?? data.email,
          });
          onSuccess?.();
        } else {
          const body = await response.json().catch(() => ({}));
          if (response.status === 401) {
            setFormError('Incorrect email or password. Please try again.');
          } else {
            setFormError(body.error || 'Unable to sign in. Please try again later.');
          }
        }
      } catch {
        setFormError('Network error. Please check your connection and try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${className} space-y-6`}
      aria-busy={isSubmitting}
      noValidate
    >
      {/* Error banner */}
      {formError && (
        <div role="alert" className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            />
          </svg>
          <p className="text-sm font-medium text-red-800">{formError}</p>
        </div>
      )}

      {/* Institutional Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-bold text-slate-700 uppercase tracking-widest ml-1"
        >
          Institutional Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">
              alternate_email
            </span>
          </div>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@healthcare.com"
            aria-invalid={!!errors.email}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all outline-none text-slate-900 placeholder:text-slate-400"
          />
        </div>
        {errors.email && (
          <p className="text-xs font-medium text-red-600 ml-1">{errors.email.message}</p>
        )}
      </div>

      {/* Security Key (Password) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label
            htmlFor="password"
            className="block text-xs font-bold text-slate-700 uppercase tracking-widest"
          >
            Security Key
          </label>
          <a
            href="#"
            className="text-xs font-bold text-primary hover:text-primary-container transition-colors"
          >
            Recovery options
          </a>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">
              lock
            </span>
          </div>
          <input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all outline-none text-slate-900 placeholder:text-slate-400"
          />
        </div>
        {errors.password && (
          <p className="text-xs font-medium text-red-600 ml-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={`w-full py-4 rounded-xl font-bold tracking-wider text-sm text-white shadow-lg transition-all transform active:scale-[0.98] uppercase ${
          isSubmitting
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-container shadow-primary/30 hover:shadow-xl'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
            Signing in…
          </span>
        ) : (
          'Sign In to Secure Portal'
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-200" />
        <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          secure authentication
        </span>
        <div className="flex-grow border-t border-slate-200" />
      </div>

      {/* SSO / BioID */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-3 bg-white border border-slate-200 py-3 px-4 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-xl text-slate-500">google</span>
          <span className="text-xs font-bold uppercase tracking-wider">SSO</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-3 bg-white border border-slate-200 py-3 px-4 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-xl text-slate-500">fingerprint</span>
          <span className="text-xs font-bold uppercase tracking-wider">BioID</span>
        </button>
      </div>
    </form>
  );
};

LoginForm.displayName = 'LoginForm';
