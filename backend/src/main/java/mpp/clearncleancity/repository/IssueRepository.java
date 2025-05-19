package mpp.clearncleancity.repository;


import mpp.clearncleancity.model.User;
import mpp.clearncleancity.model.issue.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {


    List<Issue> findByUser(User user);


    List<Issue> findByCategory(String category);


    List<Issue> findByStatus(String status);
}