package cz.jzitnik.quizapp.controllers;

import java.util.Optional;
import java.util.stream.Collectors;

import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import cz.jzitnik.quizapp.payload.request.PasswordChangeRequest;
import cz.jzitnik.quizapp.repository.PlayingStateRepository;
import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.payload.response.MeHeaderResponse;
import cz.jzitnik.quizapp.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import cz.jzitnik.quizapp.entities.User;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PlayingStateRepository playingStateRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public User authenticateUser() {
        return userService.getCurrentUser();
    }

    @GetMapping
    public ResponseEntity<User> getUser(@RequestParam("username") String username) {
        Optional<User> user =  userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user.get());
    }

    @GetMapping("/finished")
    public ResponseEntity<Integer> getFinished(@RequestParam("username") String username) {
        Optional<User> user =  userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var validatedQuizAnswers = user.get().getValidatedQuizAnswers().stream().filter(ValidatedQuizAnswer::isFinished).collect(Collectors.toSet());

        return ResponseEntity.ok(validatedQuizAnswers.size());
    }

    @GetMapping("/me/header")
    @PreAuthorize("isAuthenticated()")
    public MeHeaderResponse meDisplayName() {
        var logedUser = userService.getCurrentUser();
        return new MeHeaderResponse(
                logedUser.getUsername(),
                logedUser.getDisplayName()
        );
    }

    @GetMapping("/me/playing")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> mePlaying() {
        var user = userService.getCurrentUser();
        var stateOptional = playingStateRepository.findByUser(user);

        if (stateOptional.isEmpty()) {
            return ResponseEntity.ok(false);
        }

        return ResponseEntity.ok(true);
    }

    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changeUserDetails(@RequestBody User user) {
        var loggedUser = userService.getCurrentUser();
        loggedUser.setDisplayName(user.getDisplayName());
        loggedUser.setBio(user.getBio());

        userRepository.save(loggedUser);
        return ResponseEntity.ok("Uživatelský profil byl upraven!");
    }

    @PatchMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        var loggedUser = userService.getCurrentUser();
        var password = passwordChangeRequest.getPassword();
        var currentPassword = passwordChangeRequest.getCurrentPassword();

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loggedUser.getUsername(), currentPassword));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Heslo je nesprávné!");
        }

        loggedUser.setPassword(encoder.encode(password));
        userRepository.save(loggedUser);
        return ResponseEntity.ok("Heslo bylo úspěšně změněno.");
    }
}
