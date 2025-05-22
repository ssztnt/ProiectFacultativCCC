package mpp.clearncleancity.service;

import jakarta.transaction.Transactional;
import mpp.clearncleancity.model.entitites.PasswordResetToken;
import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.repository.PasswordResetTokenRepository;
import mpp.clearncleancity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String createResetToken(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("No user found with this email.");
        }

        User user = optionalUser.get();
        tokenRepository.deleteByUserId(user.getId()); // Clean old tokens

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiration(LocalDateTime.now().plusMinutes(15));

        tokenRepository.save(resetToken);
        return token;
    }

    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> optionalToken = tokenRepository.findByToken(token);
        return optionalToken.filter(t -> t.getExpiration().isAfter(LocalDateTime.now())).isPresent();
    }

    @Transactional
    public void updatePassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token."));

        if (resetToken.getExpiration().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.deleteByUserId(user.getId()); // Clean token after use
    }
}