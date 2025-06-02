package mpp.clearncleancity.controller;

import mpp.clearncleancity.model.entitites.Issue;
import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Vote;
import mpp.clearncleancity.repository.IssueRepository;
import mpp.clearncleancity.repository.UserRepository;
import mpp.clearncleancity.repository.VoteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private WebSocketController webSocketController;

    private static final Logger log = LoggerFactory.getLogger(VoteController.class);

    @PostMapping("/{issueId}")
    public ResponseEntity<?> vote(
            @PathVariable Long issueId,
            @RequestParam boolean upvote,
            Principal principal) {

        log.info("User '{}' voting on issue {} with upvote={}", principal.getName(), issueId, upvote);

        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        Optional<Issue> issueOpt = issueRepository.findById(issueId);

        if (userOpt.isEmpty() || issueOpt.isEmpty()) {
            log.warn("User or issue not found (user='{}', issueId={})", principal.getName(), issueId);
            return ResponseEntity.badRequest().body("User or issue not found.");
        }

        User user = userOpt.get();
        Issue issue = issueOpt.get();

        Optional<Vote> existingVoteOpt = voteRepository.findByUserAndIssue(user, issue);

        boolean voteChanged = false;

        if (existingVoteOpt.isPresent()) {
            Vote existingVote = existingVoteOpt.get();
            if (existingVote.isUpvote() == upvote) {
                voteRepository.delete(existingVote);
                log.info("Vote removed by user '{}' for issue {}", user.getUsername(), issueId);
            } else {
                existingVote.setUpvote(upvote);
                voteRepository.save(existingVote);
                log.info("Vote updated by user '{}' for issue {} to upvote={}", user.getUsername(), issueId, upvote);
                voteChanged = true;
            }
        } else {
            Vote newVote = new Vote(upvote, user, issue);
            voteRepository.save(newVote);
            log.info("New vote created by user '{}' for issue {} with upvote={}", user.getUsername(), issueId, upvote);
            voteChanged = true;
        }

        // Send WebSocket update if the vote was changed
        if (voteChanged) {
            long upvotes = voteRepository.countUpvotesByIssue(issue);
            long downvotes = voteRepository.countDownvotesByIssue(issue);

            Map<String, Object> payload = new HashMap<>();
            payload.put("issueId", issueId);
            payload.put("upvotes", upvotes);
            payload.put("downvotes", downvotes);

            webSocketController.sendVoteUpdate(payload, "voteUpdated");
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{issueId}/my-vote")
    public ResponseEntity<?> getMyVote(
            @PathVariable Long issueId,
            Principal principal) {

        if (principal == null || principal.getName() == null) {
            log.warn("Principal is null or unauthenticated");
            return ResponseEntity.status(401).body("User not authenticated");
        }

        log.info("Getting vote for user '{}' on issue {}", principal.getName(), issueId);

        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        Optional<Issue> issueOpt = issueRepository.findById(issueId);

        if (userOpt.isEmpty() || issueOpt.isEmpty()) {
            log.warn("User or issue not found (user='{}', issueId={})", principal.getName(), issueId);
            return ResponseEntity.badRequest().body("User or issue not found");
        }

        Optional<Vote> voteOpt = voteRepository.findByUserAndIssue(userOpt.get(), issueOpt.get());

        if (voteOpt.isEmpty()) {
            log.info("No vote found for user '{}' on issue {}", principal.getName(), issueId);
            return ResponseEntity.ok().body("No vote found");
        }

        log.info("Vote retrieved for user '{}' on issue {}: upvote={}", principal.getName(), issueId, voteOpt.get().isUpvote());
        return ResponseEntity.ok(voteOpt.get().isUpvote());
    }

    @GetMapping("/{issueId}/upvotes")
    public ResponseEntity<?> getUpvotes(@PathVariable Long issueId) {
        log.info("Retrieving upvotes for issue {}", issueId);
        Optional<Issue> issueOpt = issueRepository.findById(issueId);
        if (issueOpt.isEmpty()) {
            log.warn("Issue not found: {}", issueId);
            return ResponseEntity.badRequest().body("Issue not found");
        }
        long upvotes = voteRepository.countUpvotesByIssue(issueOpt.get());
        log.info("Upvotes for issue {}: {}", issueId, upvotes);
        return ResponseEntity.ok(upvotes);
    }

    @GetMapping("/{issueId}/downvotes")
    public ResponseEntity<?> getDownvotes(@PathVariable Long issueId) {
        log.info("Retrieving downvotes for issue {}", issueId);
        Optional<Issue> issueOpt = issueRepository.findById(issueId);
        if (issueOpt.isEmpty()) {
            log.warn("Issue not found: {}", issueId);
            return ResponseEntity.badRequest().body("Issue not found");
        }
        long downvotes = voteRepository.countDownvotesByIssue(issueOpt.get());
        log.info("Downvotes for issue {}: {}", issueId, downvotes);
        return ResponseEntity.ok(downvotes);
    }
}
