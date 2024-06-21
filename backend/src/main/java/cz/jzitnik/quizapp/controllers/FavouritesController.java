package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.repository.QuizRepository;
import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/favourites")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FavouritesController {
    @Autowired
    private UserService userService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Object>> getFav() {
        var user = userService.getCurrentUser();
        List<Long> favouritesId = user.getFavourites();
        Collections.reverse(favouritesId);

        List<Object> favourites = favouritesId.stream().map(id -> {
            final var quizOptional = quizRepository.findById(id);
            if (quizOptional.isEmpty()) {
                return id;
            }

            return quizOptional.get();
        }).toList();

        return ResponseEntity.ok(favourites);
    }

    @GetMapping("/quiz")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isFilled(@RequestParam("quizId") long quizId) {
        var user = userService.getCurrentUser();
        List<Long> favouritesId = user.getFavourites();
        if (favouritesId.contains(quizId)) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }

    @PostMapping("/quiz")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity setLike(@RequestParam("quizId") long quizId) {
        var user = userService.getCurrentUser();
        List<Long> favouritesId = user.getFavourites();
        if (favouritesId.contains(quizId)) {
            var quizOptional = quizRepository.findById(quizId);
            if (quizOptional.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            var quiz = quizOptional.get();
            quiz.setLikes(quiz.getLikes() - 1);
            quizRepository.save(quiz);

            favouritesId.remove(quizId);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        }

        var quizOptional = quizRepository.findById(quizId);

        if (quizOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var quiz = quizOptional.get();
        quiz.setLikes(quiz.getLikes() + 1);
        quizRepository.save(quiz);

        favouritesId.add(quizId);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/quiz")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity removeLike(@RequestParam("quizId") long quizId) {
        var user = userService.getCurrentUser();
        List<Long> favouritesId = user.getFavourites();
        if (favouritesId.contains(quizId)) {
            favouritesId.remove(quizId);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }
}
