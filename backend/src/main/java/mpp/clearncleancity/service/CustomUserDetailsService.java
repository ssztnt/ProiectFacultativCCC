package mpp.clearncleancity.service;

import mpp.clearncleancity.repository.UserRepository;
import mpp.clearncleancity.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Trying to load user with username: {}", username);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()){
            log.error("User NOT FOUND with username: {}", username);
            throw  new UsernameNotFoundException("User NOT FOUND with username: " + username);
        }

        log.info("User found with id: {} and username: {}", user.get().getId(), username);
        return new org.springframework.security.core.userdetails.User(
                user.get().getUsername(),
                user.get().getPassword(),
                Collections.emptyList()
        );
    }
}
