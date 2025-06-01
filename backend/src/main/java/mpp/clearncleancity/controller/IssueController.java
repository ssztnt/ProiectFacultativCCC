package mpp.clearncleancity.controller;

import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Issue;
import mpp.clearncleancity.model.enums.IssueCategory;
import mpp.clearncleancity.model.enums.IssueStatus;
import mpp.clearncleancity.model.enums.OrganType;
import mpp.clearncleancity.repository.IssueRepository;
import mpp.clearncleancity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
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

    @Autowired
    private WebSocketController webSocketController;

    @PostMapping("/create")
    public ResponseEntity<?> createIssue(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("location") String location,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication
    ) {
        log.info("Creating issue with image for user: {}", authentication.getName());

        try {
            String filename = null;
            String imageUrl = null;

            if (image != null && !image.isEmpty()) {
                filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path path = Paths.get("uploads", filename);
                Files.createDirectories(path.getParent());
                Files.write(path, image.getBytes());
                imageUrl = "/uploads/" + filename;
            }

            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found."));

            Issue issue = new Issue();
            issue.setTitle(title);
            issue.setDescription(description);
            issue.setCategory(IssueCategory.valueOf(category));
            issue.setLocation(location);
            issue.setLatitude(latitude);
            issue.setLongitude(longitude);
            issue.setImageUrl(imageUrl); // Poate fi null
            issue.setUser(user);
            issue.setStatus(IssueStatus.OPEN);

            Issue savedIssue = issueRepository.save(issue);
            log.info("Issue saved with ID {}", savedIssue.getId());

            sendLiveUpdate(savedIssue, "create");

            return ResponseEntity.ok(savedIssue);

        } catch (Exception e) {
            log.error("Error creating issue", e);
            return ResponseEntity.status(500).body("Failed to create issue.");
        }
    }

    @PutMapping("/{id}")
    public Issue updateIssue(@PathVariable Long id, @RequestBody Issue updatedIssue) {
        log.info("Updating issue with ID: {}", id);
        Issue existing = issueRepository.findById(id).orElseThrow(() -> {
            log.error("Issue not found with ID: {}", id);
            return new RuntimeException("Issue not found.");
        });

        existing.setTitle(updatedIssue.getTitle());
        existing.setDescription(updatedIssue.getDescription());
        existing.setCategory(updatedIssue.getCategory());
        existing.setLocation(updatedIssue.getLocation());
        existing.setStatus(updatedIssue.getStatus());
        Issue savedIssue = issueRepository.save(existing);
        log.info("Issue updated successfully with ID: {}", savedIssue.getId());

        sendLiveUpdate(savedIssue, "update");

        return savedIssue;
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
            return ResponseEntity.badRequest().body("Missing status field.");
        }

        try {
            IssueStatus newStatus = IssueStatus.valueOf(statusStr.toUpperCase());
            issue.setStatus(newStatus);
            issueRepository.save(issue);
            sendLiveUpdate(issue, "update");
            return ResponseEntity.ok(issue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value: " + statusStr);
        }
    }


    @DeleteMapping("/{id}")
    public void deleteIssue(@PathVariable Long id) {
        log.info("Deleting issue with ID: {}", id);
        Issue issue = issueRepository.findById(id).orElseThrow(() -> {
            log.error("Issue not found with ID: {}", id);
            return new RuntimeException("Issue not found");
        });

        issueRepository.deleteById(id);
        log.info("Issue deleted successfully with ID: {}", id);

        sendLiveUpdate(issue, "delete");
    }

    @GetMapping
    public List<Issue> getAllIssues() {
        log.info("Fetching all issues");
        return issueRepository.findAll();
    }

    @GetMapping("/police")
    public List<Issue> getPoliceIssues(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOrganType() != OrganType.POLITIE){
            log.info("Unauthorized access to police data.");
            throw new AuthorizationDeniedException("You are not authorized to access this information");
        }

        log.info("Fetching all Police concerning issues");
        return issueRepository.findByCategoryIn(List.of("NOISE", "BROKEN_ROAD", "AIR_POLLUTION"));
    }

    @GetMapping("/sanitation")
    public List<Issue> getSanitationIssues(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOrganType() != OrganType.SALUBRITATE){
            log.info("Unauthorized access to sanitation data.");
            throw new AuthorizationDeniedException("You are not authorized to access this information");
        }

        log.info("Fetching all sanitation concerning issues");
        return issueRepository.findByCategoryIn(List.of("GARBAGE"));
    }

    @GetMapping("/firefighter")
    public List<Issue> getFirefighterIssues(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOrganType() != OrganType.POMPIERI){
            log.info("Unauthorized access to firefight data.");
            throw new AuthorizationDeniedException("You are not authorized to access this information");
        }

        log.info("Fetching all firefighter concerning issues");
        return issueRepository.findByCategoryIn(List.of("WATER_LEAK", "FIRE"));
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<Issue>> getMyReports(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Issue> myIssues = issueRepository.findByUserId(user.getId());
        return ResponseEntity.ok(myIssues);
    }

    @GetMapping("/{id}")
    public Issue getIssueById(@PathVariable Long id) {
        log.info("Fetching issue with ID: {}", id);
        return issueRepository.findById(id).orElseThrow(() -> {
            log.error("Issue not found with ID: {}", id);
            return new RuntimeException("Issue not found");
        });
    }

    private void sendLiveUpdate(Issue issue, String action) {
        log.info("Sending live update via WebSocket for action: {}", action);
        webSocketController.sendIssueUpdate(issue, action);
    }
}