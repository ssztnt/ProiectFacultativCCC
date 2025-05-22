package mpp.clearncleancity.model.validators;

import mpp.clearncleancity.model.entitites.User;

import java.util.regex.Pattern;

public class UserValidator implements Validator<User> {
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    @Override
    public void validate(User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Invalid username!");
        }
        if (user.getFirstname() == null || user.getFirstname().isEmpty()) {
            throw new IllegalArgumentException("Invalid firstname!");
        }
        if (user.getLastname() == null || user.getLastname().isEmpty()) {
            throw new IllegalArgumentException("Invalid lastname!");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty() || user.getPassword().length() < 4) {
            throw new IllegalArgumentException("Password must be at least 4 characters long!");
        }
        if (user.getEmail() == null || !EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            throw new IllegalArgumentException("Invalid email address!");
        }
    }
}