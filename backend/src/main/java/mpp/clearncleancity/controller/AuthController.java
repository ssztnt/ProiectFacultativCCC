package mpp.clearncleancity.controller;

import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.validators.UserValidator;
import mpp.clearncleancity.repository.UserRepository;
import mpp.clearncleancity.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtil jwtUtils;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User user) {
        log.info("Authentication attempt for username: {}", user.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            user.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            log.info("Authentication successful for user: {}", user.getUsername());

            String token = jwtUtils.generateToken(userDetails.getUsername());
            User fullUser = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Ascunde parola în răspuns
            fullUser.setPassword(null);

            // Creează structura de răspuns
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", fullUser);

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            log.warn("Authentication failed for username: {} - Bad credentials", user.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");

        } catch (AuthenticationException e) {
            log.error("Unexpected error during authentication for username: {}", user.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        log.info("Trying to sign up user with username: {}", user.getUsername());

        // Validate the user
        UserValidator userValidator = new UserValidator();
        try {
            userValidator.validate(user);
        } catch (IllegalArgumentException e) {
            log.error("Validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Validation error: " + e.getMessage());
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Email is already in use!");
        }
        User newUser = new User(
                user.getUsername(),
                user.getFirstname(),
                user.getLastname(),
                encoder.encode(user.getPassword()),
                user.getEmail()
        );
        userRepository.save(newUser);
        log.info("User registered with id: {} and username: {}", user.getId(), user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }
}
