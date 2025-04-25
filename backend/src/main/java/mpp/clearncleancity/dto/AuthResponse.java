package mpp.clearncleancity.dto;

import java.util.Set;

public class AuthResponse {
    private Long id;
    private String username;
    private String email;
    private String token; // JWT token pentru autentificare
    private Set<String> roles;

    // Constructor
    public AuthResponse(Long id, String username, String email, String token, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.token = token;
        this.roles = roles;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}

