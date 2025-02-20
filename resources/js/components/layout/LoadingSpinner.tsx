// components/ui/loading-spinner.tsx
import { cn } from "../../lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  fullScreen?: boolean;
  className?: string;
  container?: boolean;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
} as const;

const variantClasses = {
  primary: 'text-primary-600 dark:text-primary-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  ghost: 'text-gray-400 dark:text-gray-600'
} as const;

const SpinnerElement = ({
  size,
  variant,
  className
}: Pick<LoadingSpinnerProps, 'size' | 'variant' | 'className'>) => (
  <div
    className={cn(
      "relative inline-flex",
      sizeClasses[size || 'md'],
      variantClasses[variant || 'primary'],
      className
    )}
  >
    <div className="absolute w-full h-full rounded-full border-2 border-solid 
                    border-current border-r-transparent animate-spin" />
    <div className="absolute w-full h-full rounded-full border-2 border-solid 
                    border-current border-r-transparent animate-pulse opacity-30" />
  </div>
);

export const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  container = false,
  className,
}: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md" />
        <div className="relative h-full flex items-center justify-center">
          <SpinnerElement size={size} variant={variant} className={className} />
        </div>
      </div>
    );
  }

  if (container) {
    return (
      <div className="relative w-full h-full min-h-[12rem]">
        <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md" />
        <div className="relative h-full flex items-center justify-center">
          <SpinnerElement size={size} variant={variant} className={className} />
        </div>
      </div>
    );
  }

  return <SpinnerElement size={size} variant={variant} className={className} />;
};

export const LoadingContainer = ({
  loading,
  children,
  size = 'md',
  variant = 'primary',
  className,
}: {
  loading: boolean;
  children: React.ReactNode;
  size?: LoadingSpinnerProps['size'];
  variant?: LoadingSpinnerProps['variant'];
  className?: string;
}) => {
  if (loading) {
    return (
      <div className={cn("relative w-full h-full min-h-[12rem]", className)}>
        <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md" />
        <div className="relative h-full flex items-center justify-center">
          <LoadingSpinner size={size} variant={variant} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingSpinner;