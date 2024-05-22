package cz.jzitnik.quizapp.controllers;


import cz.jzitnik.quizapp.entities.Question;
import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.repository.QuizRepository;
import cz.jzitnik.quizapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import cz.jzitnik.quizapp.entities.User;

import java.time.LocalDateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    UserService userService;

    @Autowired
    QuizRepository quizRepository;

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        User loggedUser = userService.getCurrentUser();

        quiz.setCreateDate(LocalDateTime.now());

        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }

        Quiz quizSaved = quizRepository.save(quiz);

        return quizSaved;
    }

}
