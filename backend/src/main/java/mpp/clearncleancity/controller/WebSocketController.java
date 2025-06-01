package mpp.clearncleancity.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class WebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendUpdate(Object payload) {
        messagingTemplate.convertAndSend("/topic/probe", payload);
    }
}