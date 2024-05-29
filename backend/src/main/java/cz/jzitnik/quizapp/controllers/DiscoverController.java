package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.services.QuizService;
import cz.jzitnik.quizapp.services.SearchService;
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

    @Autowired
    private SearchService searchService;

    @GetMapping("/page/{pageNumber}")
    public ResponseEntity<Page<Quiz>> getAllQuizzes(@PathVariable int pageNumber, @RequestParam(value = "questionCount", required = false) Integer questionCount) {
        try {
            return ResponseEntity.ok(quizService.getAllQuizzes(pageNumber - 1, 15, questionCount));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Object>> getSearch(@RequestParam(value="query") String query, @RequestParam(value="page", defaultValue = "0") int page) {
        if (query.length() == 0) {
            return ResponseEntity.ok(Page.empty());
        }
        return ResponseEntity.ok(searchService.searchUsersAndQuizzes(query, page, 15));
    }
}