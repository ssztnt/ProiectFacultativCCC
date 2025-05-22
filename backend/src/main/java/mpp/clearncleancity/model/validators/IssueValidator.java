package mpp.clearncleancity.model.validators;

import mpp.clearncleancity.model.entitites.Issue;
import mpp.clearncleancity.model.enums.IssueCategory;
import mpp.clearncleancity.model.enums.IssueStatus;

import java.util.Arrays;

public class IssueValidator implements Validator<Issue> {

    @Override
    public void validate(Issue issue) {
        if (issue.getTitle() == null || issue.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid title!");
        }

        if (!Arrays.stream(IssueCategory.values())
                .anyMatch(category -> category.name().equals(issue.getCategory().name()))) {
            throw new IllegalArgumentException("Invalid category!");
        }

        if (!Arrays.stream(IssueStatus.values())
                .anyMatch(status -> status.name().equals(issue.getStatus().name()))) {
            throw new IllegalArgumentException("Invalid status!");
        }

        if (issue.getLocation() == null || issue.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid location!");
        }
    }
}