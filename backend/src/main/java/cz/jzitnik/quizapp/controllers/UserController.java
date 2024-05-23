package cz.jzitnik.quizapp.controllers;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import cz.jzitnik.quizapp.repository.PlayingStateRepository;
import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.responses.MeHeaderResponse;
import cz.jzitnik.quizapp.services.UserService;
import jakarta.validation.Valid;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import cz.jzitnik.quizapp.entities.ERole;
import cz.jzitnik.quizapp.entities.Role;
import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.payload.request.LoginRequest;
import cz.jzitnik.quizapp.payload.request.SignupRequest;
import cz.jzitnik.quizapp.payload.response.JwtResponse;
import cz.jzitnik.quizapp.payload.response.MessageResponse;
import cz.jzitnik.quizapp.repository.RoleRepository;
import cz.jzitnik.quizapp.security.jwt.JwtUtils;
import cz.jzitnik.quizapp.security.services.UserDetailsImpl;

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
