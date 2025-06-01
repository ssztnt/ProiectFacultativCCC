package mpp.clearncleancity.controller;

import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Issue;
import mpp.clearncleancity.model.enums.IssueCategory;
import mpp.clearncleancity.model.enums.IssueStatus;
import mpp.clearncleancity.repository.IssueRepository;
import mpp.clearncleancity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path path = Paths.get("uploads", filename);
            Files.createDirectories(path.getParent());
            Files.write(path, image.getBytes());

            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

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

            sendLiveUpdate();

            return ResponseEntity.ok(savedIssue);

        } catch (Exception e) {
            log.error("Error creating issue", e);
            return ResponseEntity.status(500).body("Failed to create issue");
        }
    }

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

        sendLiveUpdate();

        return savedIssue;
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

        sendLiveUpdate();
    }

    private void sendLiveUpdate() {
        List<Issue> allIssues = issueRepository.findAll();
        log.info("Sending live update via WebSocket with {} issues", allIssues.size());
        webSocketController.sendUpdate(allIssues);
    }
}