package mpp.clearncleancity.service.impl;

import mpp.clearncleancity.dto.LoginRequest;
import mpp.clearncleancity.dto.RegisterRequest;
import mpp.clearncleancity.dto.PasswordResetRequest;
import mpp.clearncleancity.model.User;
import mpp.clearncleancity.repository.UserRepository;
import mpp.clearncleancity.service.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public User registerUser(RegisterRequest registerRequest) throws Exception {
        // Verificăm dacă username-ul este disponibil
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new Exception("Username already in use!");
        }

        // Verificăm dacă email-ul este disponibil
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new Exception("Email already in use!");
        }

        // Creăm un nou utilizator
        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setFirstName(registerRequest.getFirstName());
        newUser.setLastName(registerRequest.getLastName());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.addRole("USER");

        // Salvăm utilizatorul în baza de date
        return userRepository.save(newUser);
    }

    @Override
    public User authenticateUser(LoginRequest loginRequest) throws Exception {
        // Încercăm să găsim utilizatorul după username sau email
        Optional<User> userOptional;

        // Verificăm dacă input-ul este un email
        if (loginRequest.getUsernameOrEmail().contains("@")) {
            userOptional = userRepository.findByEmail(loginRequest.getUsernameOrEmail());
        } else {
            userOptional = userRepository.findByUsername(loginRequest.getUsernameOrEmail());
        }

        if (userOptional.isEmpty()) {
            throw new Exception("Invalid username or password!");
        }

        User user = userOptional.get();

        // Verificăm dacă contul este activ
        if (!user.isEnabled()) {
            throw new Exception("Account is disabled!");
        }

        // Verificăm dacă contul este blocat
        if (user.isAccountLocked()) {
            throw new Exception("Account is locked!");
        }

        // Verificăm parola
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new Exception("Invalid username or password!");
        }

        // Actualizăm timpul de login
        updateLastLogin(user.getId());

        return user;
    }

    @Override
    @Transactional
    public void updateLastLogin(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    @Override
    @Transactional
    public boolean initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        // Generăm un token unic
        String token = UUID.randomUUID().toString();

        // Salvăm token-ul și setăm expirarea la 24 de ore
        user.setPasswordResetToken(token);
        user.setPasswordResetExpires(LocalDateTime.now().plusHours(24));

        userRepository.save(user);

        // În implementarea reală, aici s-ar trimite un email cu link-ul de resetare

        return true;
    }

    @Override
    public Optional<User> validatePasswordResetToken(String token) {
        Optional<User> userOptional = userRepository.findByPasswordResetToken(token);

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        // Verificăm dacă token-ul a expirat
        if (user.getPasswordResetExpires().isBefore(LocalDateTime.now())) {
            return Optional.empty();
        }

        return userOptional;
    }

    @Override
    @Transactional
    public boolean resetPassword(PasswordResetRequest resetRequest) {
        Optional<User> userOptional = validatePasswordResetToken(resetRequest.getToken());

        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        // Actualizăm parola și resetăm token-ul
        user.setPassword(passwordEncoder.encode(resetRequest.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpires(null);

        userRepository.save(user);

        return true;
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    @Override
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
}