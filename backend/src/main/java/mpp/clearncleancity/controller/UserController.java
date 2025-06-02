package mpp.clearncleancity.controller;

import jakarta.servlet.http.HttpServletRequest;
import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PutMapping("/profile-picture")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfilePicture(
            @RequestParam("image") MultipartFile image,
            Authentication authentication,
            HttpServletRequest request
    ) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found."));

        try {
            // Define the upload directory in resources
            String uploadDir = System.getProperty("user.dir") + "/uploads/profile-pictures/";
            Files.createDirectories(Paths.get(uploadDir));

            // Generate a unique filename
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, filename);
            Files.write(filePath, image.getBytes());

            // Save only the filename in the database
            user.setProfilePictureUrl(filename);

            userRepository.save(user);

            return ResponseEntity.ok().body(filename);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }
}