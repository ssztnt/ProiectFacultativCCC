package mpp.clearncleancity.controller;

import jakarta.servlet.http.HttpServletRequest;
import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @PutMapping("/profile-picture")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfilePicture(
            @RequestParam("image") MultipartFile image,
            Authentication authentication,
            HttpServletRequest request
    ) {
        String username = authentication.getName();
        log.info("Profile picture update requested by user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("User not found in database: {}", username);
                    return new RuntimeException("User not found.");
                });

        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/profile-pictures/";
            Files.createDirectories(Paths.get(uploadDir));

            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, filename);
            Files.write(filePath, image.getBytes());

            user.setProfilePictureUrl(filename);
            userRepository.save(user);

            log.info("Profile picture successfully updated for user: {}", username);
            return ResponseEntity.ok().body(filename);

        } catch (IOException e) {
            log.error("Failed to upload profile picture for user: {}", username, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAllRegularUsers();
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        log.info("Trying to delete user with id: {}", id);
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    log.info("Deleted user with id: {}", id);
                    return ResponseEntity.ok().body("User deleted successfully");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

}
