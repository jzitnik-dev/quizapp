package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.Activity;
import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user/activity")
public class ActivityController {
    @Autowired
    UserRepository userRepository;


    @GetMapping
    public ResponseEntity<List<Activity>> getUser(@RequestParam("username") String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user.get().getActivity());
    }

}
