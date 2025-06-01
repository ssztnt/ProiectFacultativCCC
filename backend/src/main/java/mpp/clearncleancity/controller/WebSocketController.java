package mpp.clearncleancity.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class WebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendIssueUpdate(Object payload, String action) {
        Map<String, Object> message = new HashMap<>();
        message.put("action", action);
        message.put("data", payload);
        messagingTemplate.convertAndSend("/topic/issues", message);
    }

    public void sendVoteUpdate(Object payload, String action) {
        Map<String, Object> message = new HashMap<>();
        message.put("action", action);
        message.put("data", payload);
        messagingTemplate.convertAndSend("/topic/votes", message);
    }
}