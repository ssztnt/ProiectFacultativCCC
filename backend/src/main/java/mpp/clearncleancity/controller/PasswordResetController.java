package mpp.clearncleancity.controller;

import mpp.clearncleancity.service.PasswordResetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetController.class);

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/request")
    public ResponseEntity<?> requestReset(@RequestParam String email) {
        log.info("Password reset request received for email: {}", email);
        try {
            String token = passwordResetService.createResetToken(email);
            log.info("Reset token generated successfully for email: {}", email);
            return ResponseEntity.ok("Reset code generated: " + token);
        } catch (IllegalArgumentException e) {
            log.error("Error generating reset token for email: {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmReset(@RequestParam String token,
                                          @RequestParam String newPassword) {
        log.info("Password reset confirmation received for token: {}", token);
        try {
            passwordResetService.updatePassword(token, newPassword);
            log.info("Password updated successfully for token: {}", token);
            return ResponseEntity.ok("Password updated successfully.");
        } catch (IllegalArgumentException e) {
            log.error("Error updating password for token: {}: {}", token, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}