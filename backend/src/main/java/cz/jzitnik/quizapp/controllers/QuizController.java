package cz.jzitnik.quizapp.controllers;


import cz.jzitnik.quizapp.entities.Question;
import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import cz.jzitnik.quizapp.payload.response.QuizStatsResponse;
import cz.jzitnik.quizapp.repository.QuizRepository;
import cz.jzitnik.quizapp.repository.ValidatedQuizAnswerRepository;
import cz.jzitnik.quizapp.services.QuizStatsService;
import cz.jzitnik.quizapp.services.UserService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import cz.jzitnik.quizapp.entities.User;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    UserService userService;

    @Autowired
    QuizRepository quizRepository;

    @Autowired
    ValidatedQuizAnswerRepository validatedQuizAnswerRepository;

    @Autowired
    QuizStatsService quizStatsService;

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        User loggedUser = userService.getCurrentUser();

        quiz.setCreateDate(LocalDateTime.now());

        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }
        loggedUser.getQuizzes().add(quiz);
        quiz.setAuthor(loggedUser);

        Quiz quizSaved = quizRepository.save(quiz);

        return quizSaved;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        var quiz = quizRepository.findById(id);
        if (quiz.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(quiz.get());
    }

    @GetMapping("/author/{id}")
    public ResponseEntity<User> getAuthor(@PathVariable Long id) {
        var quizOptional = quizRepository.findById(id);
        if (quizOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var quiz = quizOptional.get();
        var author = quiz.getAuthor();
        Hibernate.initialize(author);
        return ResponseEntity.ok(author);
    }

    @GetMapping("/answer/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ValidatedQuizAnswer> getAnswer(@PathVariable Long id) {
        User loggedUser = userService.getCurrentUser();
        var quiz = quizRepository.findById(id);
        if (quiz.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var validatedQuizAnswer = validatedQuizAnswerRepository.findByUserAndQuiz(loggedUser, quiz.get());

        if (validatedQuizAnswer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(validatedQuizAnswer.get());
    }

    @GetMapping("/owned")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> getOwned(@RequestParam("quizId") Long id) {
        User loggedUser = userService.getCurrentUser();
        var quiz = quizRepository.findById(id);
        if (quiz.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (quiz.get().getAuthor().getId().equals(loggedUser.getId())) {
            return ResponseEntity.ok("true");
        }

        return ResponseEntity.ok("false");
    }

    @GetMapping("/finished")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> getFinished(@RequestParam("quizId") Long id) {
        User loggedUser = userService.getCurrentUser();
        var quiz = quizRepository.findById(id);
        if (quiz.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var validatedQuizAnswer = validatedQuizAnswerRepository.findByUserAndQuiz(loggedUser, quiz.get());

        if (validatedQuizAnswer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(validatedQuizAnswer.get().isFinished() ? "true" : "false");
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity remove(@RequestParam("quizId") Long id) {
        User loggedUser = userService.getCurrentUser();
        var quiz = quizRepository.findById(id);
        if (quiz.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!quiz.get().getAuthor().equals(loggedUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        quizRepository.delete(quiz.get());

        return ResponseEntity.ok().build();
    }



    @GetMapping("/statistics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getStats(@RequestParam("quizId") Long id) {
        User loggedUser = userService.getCurrentUser();
        var quizOptional = quizRepository.findById(id);
        if (quizOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var quiz = quizOptional.get();
        if (!quiz.getAuthor().equals(loggedUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        var stats = quizStatsService.getStats(quiz);

        if (stats.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(stats.get());
    }
}
