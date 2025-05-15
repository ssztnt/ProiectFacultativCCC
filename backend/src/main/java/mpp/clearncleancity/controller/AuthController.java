package mpp.clearncleancity.controller;

import jakarta.validation.Valid;
import mpp.clearncleancity.model.User;
import mpp.clearncleancity.repository.UserRepository;
import mpp.clearncleancity.security.JwtUtil;
import mpp.clearncleancity.service.CustomUserDetailsService;
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
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.PrintStream;

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
            return ResponseEntity.ok(token);
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
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Username is already taken!");
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
