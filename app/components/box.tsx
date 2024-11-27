import React from 'react';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
}

export const Box: React.FC<BoxProps> = ({
    as: Component = 'div',
    className,
    children,
    ...props
}) => {
    return (
        <Component className={className} {...props}>
            {children}
        </Component>
    );
};
