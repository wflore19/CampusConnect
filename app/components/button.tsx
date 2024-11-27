import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses =
        'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary:
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500',
        secondary:
            'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-500',
        tertiary:
            'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500',
    };

    const sizeClasses = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';
    const fullWidthClass = fullWidth ? 'w-full' : '';

    const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidthClass}
    ${disabled ? disabledClasses : ''}
    ${className}
  `.trim();

    return (
        <button className={buttonClasses} disabled={disabled} {...props}>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
