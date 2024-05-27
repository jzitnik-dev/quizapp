package cz.jzitnik.quizapp.controllers;

import java.util.Optional;

import cz.jzitnik.quizapp.repository.PlayingStateRepository;
import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.payload.response.MeHeaderResponse;
import cz.jzitnik.quizapp.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public ResponseEntity mePlaying() {
        var user = userService.getCurrentUser();
        var stateOptional = playingStateRepository.findByUser(user);

        if (stateOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> authenicateUser(@RequestBody User user) {
        var loggedUser = userService.getCurrentUser();
        loggedUser.setDisplayName(user.getDisplayName());
        loggedUser.setBio(user.getBio());

        userRepository.save(loggedUser);
        return ResponseEntity.ok("Uživatelský profil byl upraven!");
    }
}
