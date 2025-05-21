package mpp.clearncleancity.controller;

import mpp.clearncleancity.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/request")
    public ResponseEntity<?> requestReset(@RequestParam String email) {
        try {
            String token = passwordResetService.createResetToken(email);
            // Poți trimite tokenul pe email aici dacă adaugi email service
            return ResponseEntity.ok("Reset code generated: " + token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmReset(@RequestParam String token,
                                          @RequestParam String newPassword) {
        try {
            passwordResetService.updatePassword(token, newPassword);
            return ResponseEntity.ok("Password updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}