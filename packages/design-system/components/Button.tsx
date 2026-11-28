import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-[var(--egvox-brand-teal-700)] text-white hover:bg-[var(--egvox-brand-teal-600)]',
  secondary: 'border-[var(--egvox-border-default)] bg-[var(--egvox-bg-surface)] text-[var(--egvox-text-primary)] hover:bg-[var(--egvox-bg-subtle)]',
  tertiary: 'border-transparent bg-[var(--egvox-bg-subtle)] text-[var(--egvox-text-primary)] hover:border-[var(--egvox-border-strong)]',
  ghost: 'border-transparent bg-transparent text-[var(--egvox-text-secondary)] hover:bg-[var(--egvox-bg-subtle)]',
  destructive: 'border-transparent bg-[var(--egvox-danger)] text-white hover:brightness-95',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-5 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, iconOnly = false, disabled, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--egvox-radius-md)] border font-semibold transition-colors duration-[var(--egvox-motion-normal)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${iconOnly ? '!h-11 !w-11 !min-h-11 !shrink-0 !p-0' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
