package mpp.clearncleancity.service.interfaces;

import mpp.clearncleancity.dto.LoginRequest;
import mpp.clearncleancity.dto.RegisterRequest;
import mpp.clearncleancity.dto.PasswordResetRequest;
import mpp.clearncleancity.model.User;

import java.util.Optional;

public interface IUserService {

    /**
     * Înregistrează un utilizator nou
     * @param registerRequest Datele de înregistrare
     * @return Utilizatorul înregistrat
     * @throws Exception Dacă utilizatorul există deja sau datele nu sunt valide
     */
    User registerUser(RegisterRequest registerRequest) throws Exception;

    /**
     * Autentifică un utilizator
     * @param loginRequest Datele de autentificare
     * @return Utilizatorul autentificat
     * @throws Exception Dacă autentificarea eșuează
     */
    User authenticateUser(LoginRequest loginRequest) throws Exception;

    /**
     * Actualizează timpul ultimei autentificări
     * @param userId ID-ul utilizatorului
     */
    void updateLastLogin(Long userId);

    /**
     * Inițiază procesul de resetare a parolei
     * @param email Email-ul utilizatorului
     * @return True dacă procesul a fost inițiat cu succes
     */
    boolean initiatePasswordReset(String email);

    /**
     * Validează token-ul de resetare a parolei
     * @param token Token-ul de resetare
     * @return Utilizatorul asociat token-ului sau Optional gol dacă token-ul este invalid
     */
    Optional<User> validatePasswordResetToken(String token);

    /**
     * Resetează parola utilizatorului
     * @param resetRequest Datele pentru resetarea parolei
     * @return True dacă parola a fost resetată cu succes
     */
    boolean resetPassword(PasswordResetRequest resetRequest);

    /**
     * Găsește un utilizator după ID
     * @param id ID-ul utilizatorului
     * @return Utilizatorul găsit sau Optional gol
     */
    Optional<User> findById(Long id);

    /**
     * Găsește un utilizator după username
     * @param username Username-ul utilizatorului
     * @return Utilizatorul găsit sau Optional gol
     */
    Optional<User> findByUsername(String username);

    /**
     * Găsește un utilizator după email
     * @param email Email-ul utilizatorului
     * @return Utilizatorul găsit sau Optional gol
     */
    Optional<User> findByEmail(String email);

    /**
     * Verifică dacă un username este disponibil
     * @param username Username-ul de verificat
     * @return True dacă username-ul este disponibil
     */
    boolean isUsernameAvailable(String username);

    /**
     * Verifică dacă un email este disponibil
     * @param email Email-ul de verificat
     * @return True dacă email-ul este disponibil
     */
    boolean isEmailAvailable(String email);
}
