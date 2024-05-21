package cz.jzitnik.quizapp.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.services.UserService;
import jakarta.validation.Valid;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public User authenticateUser() {
        return userService.getCurrentUser();
    }

    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> authenicateUser(@RequestBody User user) {
        var logedUser = userService.getCurrentUser();
        logedUser.setUsername(user.getUsername());
        logedUser.setDisplayName(user.getDisplayName());
        logedUser.setBio(user.getBio());

        userRepository.save(logedUser);

        return ResponseEntity.ok("Uživatelský profil byl upraven!");
    }
}
