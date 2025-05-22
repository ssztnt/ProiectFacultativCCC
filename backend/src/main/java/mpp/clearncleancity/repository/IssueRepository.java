package mpp.clearncleancity.repository;


import mpp.clearncleancity.model.entitites.User;
import mpp.clearncleancity.model.entitites.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {


    List<Issue> findByUser(User user);


    List<Issue> findByCategory(String category);


    List<Issue> findByStatus(String status);
}