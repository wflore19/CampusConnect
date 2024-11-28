import { Flex, Spinner } from '@radix-ui/themes';
import React from 'react';
import { Socket, io } from 'socket.io-client';

export const SocketContext = React.createContext<Socket | null>(null);

export const useSocket = () => {
    const socket = React.useContext(SocketContext);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return { socket };
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [isConnecting, setIsConnecting] = React.useState(true);

    React.useEffect(() => {
        const newSocket = io('http://localhost:5000');

        newSocket.on('connect', () => {
            setSocket(newSocket);
            setIsConnecting(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnecting(false);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
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
