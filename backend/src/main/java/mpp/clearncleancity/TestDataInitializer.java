package mpp.clearncleancity;

import mpp.clearncleancity.dto.LoginRequest;
import mpp.clearncleancity.dto.RegisterRequest;
import mpp.clearncleancity.model.User;
import mpp.clearncleancity.service.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TestDataInitializer implements CommandLineRunner {

    private final IUserService userService;

    @Autowired
    public TestDataInitializer(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Creează un utilizator de test
        System.out.println("Crearea unui utilizator de test...");

        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("Test");
        registerRequest.setLastName("User");

        try {
            User registeredUser = userService.registerUser(registerRequest);
            System.out.println("Utilizator creat cu succes: " + registeredUser.getUsername());

            // Testează autentificarea
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsernameOrEmail("testuser");
            loginRequest.setPassword("password123");

            User authenticatedUser = userService.authenticateUser(loginRequest);
            System.out.println("Autentificare reușită pentru: " + authenticatedUser.getUsername());

        } catch (Exception e) {
            System.err.println("Eroare la testarea utilizatorului: " + e.getMessage());
        }
    }
}