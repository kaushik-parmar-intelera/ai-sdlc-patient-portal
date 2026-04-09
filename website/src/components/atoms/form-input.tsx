'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputBaseClassName?: string;
  inputVariant?: 'outlined' | 'filled';
  trailingIcon?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      hint,
      required,
      type = 'text',
      id,
      containerClassName = '',
      labelClassName = '',
      inputBaseClassName = '',
      disabled = false,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      className,
      inputVariant = 'outlined',
      trailingIcon,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    const describedByParts = [errorId, hintId, ariaDescribedBy].filter(Boolean);
    const finalAriaDescribedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

    // Stitch Clinical Curator: bottom-border only, no ring, no radius
    const outlinedInputClasses = [
      'w-full px-4 py-3',
      'text-base text-on-surface placeholder-on-surface-variant',
      'bg-surface-container-low border-0 border-b border-primary',
      'transition-all duration-200',
      'outline-none focus:bg-surface-container-lowest focus:border-b-2 focus:ring-0',
      'disabled:bg-surface-dim disabled:text-on-surface-variant disabled:border-outline-variant disabled:cursor-not-allowed',
      error ? 'border-b-error focus:border-b-error' : '',
    ].filter(Boolean).join(' ');

    const filledInputClasses = [
      'w-full px-4 py-3',
      'text-base text-on-surface placeholder-on-surface-variant',
      'bg-surface-container border-b-2 border-primary rounded-t-clinic-sm',
      'transition-all duration-200',
      'outline-none focus:bg-surface-container-lowest focus:border-b-primary focus:ring-0',
      'disabled:bg-surface-dim disabled:text-on-surface-variant disabled:border-outline-variant disabled:cursor-not-allowed',
      error ? 'border-b-error focus:border-b-error' : '',
    ].filter(Boolean).join(' ');

    const inputClasses = [
      inputBaseClassName || (inputVariant === 'filled' ? filledInputClasses : outlinedInputClasses),
      className,
    ].filter(Boolean).join(' ');

    const labelClasses = [
      labelClassName || 'block text-sm font-semibold text-on-surface-variant ml-1',
      required ? "after:content-['*'] after:ml-1 after:text-error" : '',
    ].filter(Boolean).join(' ');

    return (
      <div className={`${containerClassName} space-y-1`}>
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder || label}
            disabled={disabled}
            required={required}
            aria-label={ariaLabel || label}
            aria-invalid={!!error}
            aria-describedby={finalAriaDescribedBy}
            className={inputClasses}
            {...rest}
          />
          {trailingIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
              {trailingIcon}
            </span>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-[10px] text-on-surface-variant px-1">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-xs font-medium text-error flex items-center gap-1 px-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
