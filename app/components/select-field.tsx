import React from 'react';
import { cx } from '~/utils/cx';

type SelectFieldProps = {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'surface' | 'classic';
    color?: 'default' | 'primary' | 'secondary';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    defaultValue?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

export const SelectField = React.forwardRef<
    HTMLSelectElement,
    SelectFieldProps
>(
    (
        {
            size = 'md',
            variant = 'classic',
            color = 'default',
            radius = 'md',
            disabled,
            error,
            defaultValue,
            value,
            onChange,
            children,
            className,
            ...props
        },
        ref
    ) => {
        const baseClasses =
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all appearance-none';
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
            <div className="relative">
                <select
                    ref={ref}
                    disabled={disabled}
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
                >
                    {children}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        );
    }
);

SelectField.displayName = 'SelectField';

// SelectItem component
type SelectItemProps = {
    value: string;
    children: React.ReactNode;
} & React.OptionHTMLAttributes<HTMLOptionElement>;

export const SelectItem: React.FC<SelectItemProps> = ({
    value,
    children,
    ...props
}) => {
    return (
        <option value={value} {...props}>
            {children}
        </option>
    );
};

// SelectField label component
type SelectFieldLabelProps = {
    htmlFor: string;
    className?: string;
    children: React.ReactNode;
};

export const SelectFieldLabel: React.FC<SelectFieldLabelProps> = ({
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
