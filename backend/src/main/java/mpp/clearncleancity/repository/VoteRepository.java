package mpp.clearncleancity.repository;

import mpp.clearncleancity.model.entitites.Vote;
import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    // verifică dacă userul a votat deja pe un anumit issue
    Optional<Vote> findByUserAndIssue(User user, Issue issue);

    // număr total de upvotes pentru un issue
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.issue = :issue AND v.upvote = true")
    long countUpvotesByIssue(Issue issue);

    // număr total de downvotes pentru un issue
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.issue = :issue AND v.upvote = false")
    long countDownvotesByIssue(Issue issue);

    // scor total (upvotes - downvotes) – dacă vrei direct
    @Query("SELECT SUM(CASE WHEN v.upvote = true THEN 1 ELSE -1 END) FROM Vote v WHERE v.issue = :issue")
    Integer getScoreForIssue(Issue issue);
}
