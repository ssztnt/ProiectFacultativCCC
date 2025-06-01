import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

let stompClient: Client | null = null;

export const connectWebSocket = (onMessageReceived: (data: any) => void) => {
    stompClient = new Client({
        webSocketFactory: () => new SockJS('http://192.168.101.133:7777/ws'),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('WebSocket connected.');
            stompClient?.subscribe('/topic/probe', (message: IMessage) => {
                const payload = JSON.parse(message.body);
                console.log('!!!!!WS message received:', payload);
                onMessageReceived(payload);
            });
        },
        onStompError: (frame) => {
            console.error('STOMP error:', frame.headers['message']);
            console.error('Details:', frame.body);
        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        console.log('WebSocket disconnected.');
    }
};
