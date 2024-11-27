import React from 'react';
import { cx } from '~/utils/cx';

type TextFieldProps = {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'surface' | 'classic';
    color?: 'default' | 'primary' | 'secondary';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    error?: boolean;
    defaultValue?: string | number | undefined;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            size = 'md',
            variant = 'classic',
            color = 'default',
            radius = 'md',
            placeholder,
            disabled,
            readOnly,
            error,
            defaultValue,
            value,
            onChange,
            className,
            ...props
        },
        ref
    ) => {
        const baseClasses =
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all';
        const sizeClasses = {
            sm: 'text-sm h-8',
            md: 'text-base h-10',
            lg: 'text-lg h-12',
        };
        const variantClasses = {
            surface: 'bg-gray-100',
            classic: 'bg-white',
        };
        const colorClasses = {
            default:
                'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
            primary:
                'border-blue-300 focus:border-blue-500 focus:ring-blue-200',
            secondary:
                'border-purple-300 focus:border-purple-500 focus:ring-purple-200',
        };
        const radiusClasses = {
            none: 'rounded-none',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            full: 'rounded-full',
        };
        const stateClasses = cx(
            disabled ? 'cursor-not-allowed opacity-50' : '',
            error
                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : ''
        );

        return (
            <input
                ref={ref}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
                className={cx(
                    baseClasses,
                    sizeClasses[size],
                    variantClasses[variant],
                    colorClasses[color],
                    radiusClasses[radius],
                    stateClasses,
                    className
                )}
                {...props}
            />
        );
    }
);

TextField.displayName = 'TextField';

type TextFieldLabelProps = {
    htmlFor: string;
    className?: string;
    children: React.ReactNode; // Added this line
};

export const TextFieldLabel: React.FC<TextFieldLabelProps> = ({
    htmlFor,
    className,
    children,
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-700 ${className}`}
        >
            {children}
        </label>
    );
};
