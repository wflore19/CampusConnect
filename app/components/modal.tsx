import { Link, type LinkProps } from '@remix-run/react';
import React, { type PropsWithChildren, useContext } from 'react';
import { createPortal } from 'react-dom';

import { useHydrated } from '~/hooks/useHydrated';
import { cx } from '../utils/cx';
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
            <div
                className={cx(
                    'fixed z-50 flex h-screen w-screen justify-center',
                    'bottom-0 items-center', // Mobile
                    'sm:top-0' // > Mobile
                )}
            >
                <aside
                    className={cx(
                        'lock-scroll relative z-10 flex max-h-[calc(100vh-5rem)] w-[400px] flex-col gap-4 overflow-auto bg-white px-4 py-8',
                        'animate-[modal-animation-mobile_250ms] rounded-lg',
                        'sm:animate-[modal-animation_250ms] sm:rounded-lg',
                        size === '400' && 'max-w-[400px]',
                        size === '600' && 'max-w-[600px]'
                    )}
                    id="modal"
                    role="dialog"
                >
                    {children}
                </aside>

                <Link
                    className={cx(
                        'absolute inset-0 cursor-default bg-black',
                        'animate-[modal-shader-animation_250ms_forwards]'
                    )}
                    preventScrollReset
                    to={onCloseTo}
                />
            </div>
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
    return (
        <Text size="3" color="gray">
            {children}
        </Text>
    );
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
        <Flex mt={'4'} justify={'end'} gap={'3'}>
            {children}
        </Flex>
    );
};
