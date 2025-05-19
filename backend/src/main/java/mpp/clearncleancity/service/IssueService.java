package mpp.clearncleancity.service;


import mpp.clearncleancity.model.User;
import mpp.clearncleancity.model.issue.Issue;
import mpp.clearncleancity.repository.IssueRepository;
import mpp.clearncleancity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;


    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    public Issue createIssue(Issue issue, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        issue.setUser(user);
        return issueRepository.save(issue);
    }

    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    public List<Issue> getIssuesByUser(User user) {
        return issueRepository.findByUser(user);
    }

    public List<Issue> getIssuesByCategory(String category) {
        return issueRepository.findByCategory(category);
    }

    public List<Issue> getIssuesByStatus(String status) {
        return issueRepository.findByStatus(status);
    }
}