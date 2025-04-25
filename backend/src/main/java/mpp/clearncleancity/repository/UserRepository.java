package mpp.clearncleancity.repository;

import mpp.clearncleancity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Găsește un utilizator după username
     */
    Optional<User> findByUsername(String username);

    /**
     * Găsește un utilizator după email
     */
    Optional<User> findByEmail(String email);

    /**
     * Verifică dacă există un utilizator cu username-ul specificat
     */
    boolean existsByUsername(String username);

    /**
     * Verifică dacă există un utilizator cu email-ul specificat
     */
    boolean existsByEmail(String email);

    /**
     * Găsește un utilizator după token-ul de resetare a parolei
     */
    Optional<User> findByPasswordResetToken(String token);
}
