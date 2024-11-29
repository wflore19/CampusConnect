import { Flex, Spinner } from '@radix-ui/themes';
import React, { PropsWithChildren, ReactNode } from 'react';
import { Socket, io } from 'socket.io-client';

export const SocketContext = React.createContext<Socket | null>(null);

export const useSocket = () => {
    const socket = React.useContext(SocketContext);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return { socket };
};

interface SocketProviderProps {
    userId: string;
    children?: ReactNode;
}

export function SocketProvider({
    userId,
    children,
}: PropsWithChildren<SocketProviderProps>) {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [isConnecting, setIsConnecting] = React.useState(true);

    React.useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            auth: {
                userId,
            },
        });

        newSocket.on('connect', () => {
            setSocket(newSocket);
            setIsConnecting(false);
        });

        newSocket.on('connect_error', (error) => {
            setIsConnecting(false);
        });

        newSocket.on('disconnect', () => {
            setSocket(null);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    if (isConnecting) {
        return (
            <Flex justify={'center'} align={'center'} height={'100vh'}>
                <Spinner />
            </Flex>
        );
    }

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
