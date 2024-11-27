import { Link, type LinkProps } from '@remix-run/react';
import React, { type PropsWithChildren, useContext } from 'react';
import { createPortal } from 'react-dom';

import { useHydrated } from '~/hooks/useHydrated';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';
import { RiCloseFill } from '@remixicon/react';

const ModalContext = React.createContext({
    _initialized: false,
    onCloseTo: '' as LinkProps['to'],
});

export function useIsModalParent() {
    const { _initialized } = useContext(ModalContext);

    return !!_initialized;
}

type ModalProps = PropsWithChildren<{
    onCloseTo: LinkProps['to'];
    size?: '400' | '600';
}>;

export const Modal = ({
    children,
    onCloseTo,
    size = '600',
}: ModalProps): JSX.Element | null => {
    const hydrated = useHydrated();

    if (!hydrated) {
        return null;
    }

    return createPortal(
        <ModalContext.Provider value={{ _initialized: true, onCloseTo }}>
            <Box
                position="fixed"
                px={'5'}
                style={{
                    zIndex: 50,
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Flex
                    direction={'column'}
                    gap={'2'}
                    p={'7'}
                    maxHeight={'calc(100vh - 5rem)'}
                    overflowY={'auto'}
                    position={'relative'}
                    style={{
                        zIndex: 10,
                        backgroundColor: 'var(--color-panel-solid)',
                        borderRadius: 'var(--radius-4)',
                        width: size === '400' ? '400px' : '600px',
                        animation: 'modal-animation 250ms',
                    }}
                    role="dialog"
                >
                    {children}
                </Flex>

                <Link
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        animation: 'modal-shader-animation 250ms forwards',
                    }}
                    preventScrollReset
                    to={onCloseTo}
                />
            </Box>
        </ModalContext.Provider>,
        document.querySelector('.htmlRoot')!
    );
};

Modal.CloseButton = function ModalCloseButton() {
    const { onCloseTo } = useContext(ModalContext);

    return (
        <Link preventScrollReset to={onCloseTo}>
            <RiCloseFill size={32} />
        </Link>
    );
};

Modal.Description = function ModalDescription({ children }: PropsWithChildren) {
    return <Text size="3">{children}</Text>;
};

Modal.Header = function ModalHeader({ children }: PropsWithChildren) {
    return (
        <Flex justify="between" align={'center'}>
            {children}
        </Flex>
    );
};

Modal.Title = function ModalTitle({ children }: PropsWithChildren) {
    return <Heading size="4">{children}</Heading>;
};

Modal.Content = function ModalContent({ children }: PropsWithChildren) {
    return <Box>{children}</Box>;
};

Modal.Actions = function ModalActions({ children }: PropsWithChildren) {
    return (
        <Flex pt={'5'} justify={'end'} gap={'3'}>
            {children}
        </Flex>
    );
};
