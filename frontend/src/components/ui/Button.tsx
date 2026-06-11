import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
}

export function Button({ children, variant = 'primary', isLoading, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 ${
        variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
        variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' :
        variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
        'border border-gray-300 hover:bg-gray-50 text-gray-700'
      } ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
