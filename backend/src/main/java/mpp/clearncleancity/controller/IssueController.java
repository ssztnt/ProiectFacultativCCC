package mpp.clearncleancity.controller;

import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Issue;
import mpp.clearncleancity.model.enums.IssueCategory;
import mpp.clearncleancity.model.enums.IssueStatus;
import mpp.clearncleancity.model.validators.IssueValidator;
import mpp.clearncleancity.repository.IssueRepository;
import mpp.clearncleancity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class IssueController {
    private static final Logger log = LoggerFactory.getLogger(IssueController.class);

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    // GET all issues
    @GetMapping
    public List<Issue> getAllIssues() {
        log.info("Fetching all issues");
        return issueRepository.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createIssue(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("location") String location,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("image") MultipartFile image,
            Authentication authentication
    ) {
        log.info("Creating issue with image for user: {}", authentication.getName());

        try {
            // Save image
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path path = Paths.get("uploads", filename);
            Files.createDirectories(path.getParent());
            Files.write(path, image.getBytes());

            // Get user
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Build issue
            Issue issue = new Issue();
            issue.setTitle(title);
            issue.setDescription(description);
            issue.setCategory(IssueCategory.valueOf(category));
            issue.setLocation(location);
            issue.setLatitude(latitude);
            issue.setLongitude(longitude);
            issue.setImageUrl("/uploads/" + filename);
            issue.setUser(user);
            issue.setStatus(IssueStatus.OPEN);

            Issue savedIssue = issueRepository.save(issue);
            log.info("Issue saved with ID {}", savedIssue.getId());
            return ResponseEntity.ok(savedIssue);

        } catch (Exception e) {
            log.error("Error creating issue", e);
            return ResponseEntity.status(500).body("Failed to create issue");
        }
    }

    // GET issue by ID
    @GetMapping("/{id}")
    public Issue getIssueById(@PathVariable Long id) {
        log.info("Fetching issue with ID: {}", id);
        return issueRepository.findById(id).orElseThrow(() -> {
            log.error("Issue not found with ID: {}", id);
            return new RuntimeException("Issue not found");
        });
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateIssueStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Issue> optionalIssue = issueRepository.findById(id);
        if (optionalIssue.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Issue issue = optionalIssue.get();

        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body("Missing status field");
        }

        try {
            IssueStatus newStatus = IssueStatus.valueOf(statusStr.toUpperCase());
            issue.setStatus(newStatus);
            issueRepository.save(issue);
            return ResponseEntity.ok(issue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value: " + statusStr);
        }
    }

    // PUT update issue
    @PutMapping("/{id}")
    public Issue updateIssue(@PathVariable Long id, @RequestBody Issue updatedIssue) {
        log.info("Updating issue with ID: {}", id);
        Issue existing = issueRepository.findById(id).orElseThrow(() -> {
            log.error("Issue not found with ID: {}", id);
            return new RuntimeException("Issue not found");
        });

        existing.setTitle(updatedIssue.getTitle());
        existing.setDescription(updatedIssue.getDescription());
        existing.setCategory(updatedIssue.getCategory());
        existing.setLocation(updatedIssue.getLocation());
        existing.setStatus(updatedIssue.getStatus());
        Issue savedIssue = issueRepository.save(existing);
        log.info("Issue updated successfully with ID: {}", savedIssue.getId());
        return savedIssue;
    }

    // DELETE issue
    @DeleteMapping("/{id}")
    public void deleteIssue(@PathVariable Long id) {
        log.info("Deleting issue with ID: {}", id);
        if (!issueRepository.existsById(id)) {
            log.error("Issue not found with ID: {}", id);
            throw new RuntimeException("Issue not found");
        }
        issueRepository.deleteById(id);
        log.info("Issue deleted successfully with ID: {}", id);
    }


}