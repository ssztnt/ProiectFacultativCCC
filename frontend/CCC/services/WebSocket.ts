import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { IPaddress } from '@/constants/NetworkConfig';

let stompClient: Client | null = null;

export const connectWebSocket = (
    onIssueMessageReceived: (data: any) => void
) => {
    stompClient = new Client({
        webSocketFactory: () => new SockJS(`${IPaddress}/ws`),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('WebSocket connected.');

            // Subscribe to issue updates
            stompClient?.subscribe('/topic/issues', (message: IMessage) => {
                const payload = JSON.parse(message.body);
                console.log('Issue WS message received:', payload);
                onIssueMessageReceived(payload);
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