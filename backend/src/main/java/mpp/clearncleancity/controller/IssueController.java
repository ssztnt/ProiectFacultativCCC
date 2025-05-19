package mpp.clearncleancity.controller;

import mpp.clearncleancity.model.User;
import mpp.clearncleancity.model.issue.Issue;
import mpp.clearncleancity.repository.IssueRepository;
import mpp.clearncleancity.repository.UserRepository;
import mpp.clearncleancity.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    // GET all issues
    @GetMapping
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createIssue(@RequestBody Issue issue, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        issue.setUser(user);
        return ResponseEntity.ok(issueRepository.save(issue));
    }


    // GET issue by ID
    @GetMapping("/{id}")
    public Issue getIssueById(@PathVariable Long id) {
        return issueRepository.findById(id).orElseThrow();
    }

    // PUT update issue
    @PutMapping("/{id}")
    public Issue updateIssue(@PathVariable Long id, @RequestBody Issue updatedIssue) {
        Issue existing = issueRepository.findById(id).orElseThrow();
        existing.setTitle(updatedIssue.getTitle());
        existing.setDescription(updatedIssue.getDescription());
        existing.setCategory(updatedIssue.getCategory());
        existing.setLocation(updatedIssue.getLocation());
        existing.setStatus(updatedIssue.getStatus());
        return issueRepository.save(existing);
    }

    // DELETE issue
    @DeleteMapping("/{id}")
    public void deleteIssue(@PathVariable Long id) {
        issueRepository.deleteById(id);
    }
}