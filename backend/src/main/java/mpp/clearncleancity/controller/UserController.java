package mpp.clearncleancity.controller;

import jakarta.servlet.http.HttpServletRequest;
import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
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
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // Creează directorul de upload relativ la directorul aplicației
            String uploadDir = System.getProperty("user.dir") + "/backend/uploads/profile_pictures/";
            new File(uploadDir).mkdirs();

            // Salvează imaginea pe disc
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            File file = new File(uploadDir + filename);
            image.transferTo(file);

            // Construiește URL-ul public (presupunând că static-locations e configurat)
            // Generează URL complet către imagine
            String baseUrl = "http://192.168.101.126:7777"; // înlocuiește cu IP-ul tău
            String imageUrl = baseUrl + "/uploads/profile_pictures/" + filename;
            user.setProfilePictureUrl(imageUrl);

            // Salvează în baza de date
            userRepository.save(user);

            return ResponseEntity.ok().body(imageUrl);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }
}