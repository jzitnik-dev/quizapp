package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.PlayingState;
import cz.jzitnik.quizapp.repository.PlayingStateRepository;
import cz.jzitnik.quizapp.repository.QuizRepository;
import cz.jzitnik.quizapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/play")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PlayController {
    @Autowired
    private UserService userService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private PlayingStateRepository playingStateRepository;

    @PostMapping("/register")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> playUser(@RequestParam("quizId") long quizId) {
        var user = userService.getCurrentUser();
        var quiz = quizRepository.findById(quizId);
        var stateOptional = playingStateRepository.findByUser(user);

        if (quiz.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (quiz.get().getAuthor().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (!stateOptional.isEmpty()) {
            playingStateRepository.delete(stateOptional.get());
        }

        var playingState = new PlayingState(user, quiz.get());

        var savedState = playingStateRepository.save(playingState);
        return ResponseEntity.ok(savedState.getSecretKey());
    }

    @GetMapping("/isValid")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity isValid(@RequestParam("key") String key, @RequestParam("quizId") Long quizId) {
        var user = userService.getCurrentUser();
        var state = playingStateRepository.findBySecretKey(key);

        if (state.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (state.get().getUser().getId() != user.getId() || state.get().getQuiz().getId() != quizId) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }
}
