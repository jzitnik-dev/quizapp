package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/discover")
public class DiscoverController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/page/{pageNumber}")
    public ResponseEntity<Page<Quiz>> getAllQuizzes(@PathVariable int pageNumber) {
        try {
            return ResponseEntity.ok(quizService.getAllQuizzes(pageNumber - 1, 15));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}