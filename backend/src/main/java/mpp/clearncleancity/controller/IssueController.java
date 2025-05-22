package mpp.clearncleancity.controller;

import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Issue;
import mpp.clearncleancity.model.validators.IssueValidator;
import mpp.clearncleancity.repository.IssueRepository;
import mpp.clearncleancity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    // GET all issues
    @GetMapping
    public List<Issue> getAllIssues() {
        log.info("Fetching all issues");
        return issueRepository.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createIssue(@RequestBody Issue issue, Authentication authentication) {
        log.info("Attempting to create a new issue with title: {}", issue.getTitle());

        // Validate the issue
        IssueValidator issueValidator = new IssueValidator();
        try {
            issueValidator.validate(issue);
        } catch (IllegalArgumentException e) {
            log.error("Validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Validation error: " + e.getMessage());
        }

        String username = authentication.getName();
        log.debug("Authenticated user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("User not found for username: {}", username);
                    return new RuntimeException("User not found");
                });

        issue.setUser(user);
        Issue savedIssue = issueRepository.save(issue);
        log.info("Issue created successfully with ID: {}", savedIssue.getId());
        return ResponseEntity.ok(savedIssue);
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