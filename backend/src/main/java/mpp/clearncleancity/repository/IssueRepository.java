package mpp.clearncleancity.repository;


import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByUser(User user);

    List<Issue> findByCategory(String category);

    List<Issue> findByCategoryIn(List<String> types);

    List<Issue> findByStatus(String status);

    List<Issue> findByUserId(Long userId);

    @Query("SELECT i FROM Issue i LEFT JOIN i.votes v ON v.upvote = true GROUP BY i.id ORDER BY COUNT(v) DESC")
    List<Issue> findAllSortedByUpvotes();
}