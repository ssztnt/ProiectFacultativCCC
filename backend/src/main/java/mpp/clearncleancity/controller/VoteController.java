package mpp.clearncleancity.controller;

import mpp.clearncleancity.model.entitites.Issue;
import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Vote;
import mpp.clearncleancity.repository.IssueRepository;
import mpp.clearncleancity.repository.UserRepository;
import mpp.clearncleancity.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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

    // 1. POST vote (upvote or downvote)
    @PostMapping("/{issueId}")
    public ResponseEntity<?> vote(
            @PathVariable Long issueId,
            @RequestParam boolean upvote,
            Principal principal) {

        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        Optional<Issue> issueOpt = issueRepository.findById(issueId);

        if (userOpt.isEmpty() || issueOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or issue not found.");
        }

        User user = userOpt.get();
        Issue issue = issueOpt.get();

        Optional<Vote> existingVoteOpt = voteRepository.findByUserAndIssue(user, issue);

        if (existingVoteOpt.isPresent()) {
            Vote existingVote = existingVoteOpt.get();

            if (existingVote.isUpvote() == upvote) {
                // 1. Apasă pe votul deja dat -> sterge votul
                voteRepository.delete(existingVote);
            } else {
                // 2. Apasă pe votul opus -> actualizeaza votul
                existingVote.setUpvote(upvote);
                voteRepository.save(existingVote);
            }
        } else {
            // 3. Nu a votat inca -> creeaza vot nou
            Vote newVote = new Vote(upvote, user, issue);
            voteRepository.save(newVote);
        }

        return ResponseEntity.ok().build();
    }

    // 2. GET votul curent al userului pentru un issue
    @GetMapping("/{issueId}/my-vote")
    public ResponseEntity<?> getMyVote(
            @PathVariable Long issueId,
            Principal principal) {

        Optional<User> userOpt = userRepository.findByUsername(principal.getName());
        Optional<Issue> issueOpt = issueRepository.findById(issueId);

        if (userOpt.isEmpty() || issueOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or issue not found");
        }

        Optional<Vote> voteOpt = voteRepository.findByUserAndIssue(userOpt.get(), issueOpt.get());

        if (voteOpt.isEmpty()) {
            return ResponseEntity.ok().body(null);
        }

        return ResponseEntity.ok(voteOpt.get().isUpvote());
    }

    // 3. GET scorul total al unui issue
    @GetMapping("/{issueId}/score")
    public ResponseEntity<?> getIssueScore(@PathVariable Long issueId) {
        Optional<Issue> issueOpt = issueRepository.findById(issueId);
        if (issueOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Issue not found");
        }

        Integer score = voteRepository.getScoreForIssue(issueOpt.get());
        return ResponseEntity.ok(score != null ? score : 0);
    }

    // 4. GET numărul total de upvotes pentru un issue
    @GetMapping("/{issueId}/upvotes")
    public ResponseEntity<?> getUpvotes(@PathVariable Long issueId) {
        Optional<Issue> issueOpt = issueRepository.findById(issueId);
        if (issueOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Issue not found");
        }
        long upvotes = voteRepository.countUpvotesByIssue(issueOpt.get());
        return ResponseEntity.ok(upvotes);
    }

    // 5. GET numărul total de downvotes pentru un issue
    @GetMapping("/{issueId}/downvotes")
    public ResponseEntity<?> getDownvotes(@PathVariable Long issueId) {
        Optional<Issue> issueOpt = issueRepository.findById(issueId);
        if (issueOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Issue not found");
        }
        long downvotes = voteRepository.countDownvotesByIssue(issueOpt.get());
        return ResponseEntity.ok(downvotes);
    }
}