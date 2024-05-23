package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.PlayingState;
import cz.jzitnik.quizapp.entities.Question;
import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import cz.jzitnik.quizapp.repository.PlayingStateRepository;
import cz.jzitnik.quizapp.repository.QuizRepository;
import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.repository.ValidatedQuizAnswerRepository;
import cz.jzitnik.quizapp.services.AnswerValidationService;
import cz.jzitnik.quizapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/play/question")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuestionController {
    @Autowired
    private UserService userService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private PlayingStateRepository playingStateRepository;

    @Autowired
    private AnswerValidationService answerValidationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidatedQuizAnswerRepository validatedQuizAnswerRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Question> getQuestion(@RequestParam("key") String key, @RequestParam("question") int question) {
        var playingStateOptional = playingStateRepository.findBySecretKey(key);
        var loggedInUser = userService.getCurrentUser();

        if (playingStateOptional.isEmpty() || playingStateOptional.get().getUser().getId() != loggedInUser.getId()) {
            return ResponseEntity.notFound().build();
        }
        var playingState = playingStateOptional.get();

        if (playingState.getQuestionNumber() != question) {
            return ResponseEntity.badRequest().build();
        }

        if (playingState.getShowed()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        var quiz = playingState.getQuiz();
        var questions = quiz.getQuestions();

        List<Question> questionList = new ArrayList<>(questions);
        questionList.sort(Comparator.comparingLong(Question::getId));

        var finalQuestion = questionList.get(playingState.getQuestionNumber() - 1);
        playingState.setShowed(true);

        playingStateRepository.save(playingState);

        return ResponseEntity.ok(finalQuestion);
    }

    @PostMapping("/skip")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity skipQuestion(@RequestParam("key") String key) {
        var playingStateOptional = playingStateRepository.findBySecretKey(key);
        var loggedInUser = userService.getCurrentUser();
        if (playingStateOptional.isEmpty() || playingStateOptional.get().getUser().getId() != loggedInUser.getId()) {
            return ResponseEntity.notFound().build();
        }
        var playingState = playingStateOptional.get();
        var quiz = playingState.getQuiz();

        playingState.getAnswers().add("");

        if (playingState.getQuestionNumber() == quiz.getQuestions().size()) {
            // Finish
            // I have no idea what status code should i use for this. Don't blame me.
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
        }

        playingState.setQuestionNumber(playingState.getQuestionNumber() + 1);
        playingState.setShowed(false);

        playingStateRepository.save(playingState);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/answer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity answer(@RequestParam("key") String key, @RequestParam("answer") String answer) {
        var playingStateOptional = playingStateRepository.findBySecretKey(key);
        var loggedInUser = userService.getCurrentUser();
        if (playingStateOptional.isEmpty() || playingStateOptional.get().getUser().getId() != loggedInUser.getId()) {
            return ResponseEntity.notFound().build();
        }
        var playingState = playingStateOptional.get();
        var quiz = playingState.getQuiz();

        playingState.getAnswers().add(answer);

        if (playingState.getQuestionNumber() == quiz.getQuestions().size()) {
            playingState.setQuestionNumber(playingState.getQuestionNumber() + 1);
            playingStateRepository.save(playingState);
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
        }

        playingState.setQuestionNumber(playingState.getQuestionNumber() + 1);
        playingState.setShowed(false);

        playingStateRepository.save(playingState);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/finish")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ValidatedQuizAnswer> finish(@RequestParam("key") String key) {
        var playingStateOptional = playingStateRepository.findBySecretKey(key);
        var loggedInUser = userService.getCurrentUser();
        if (playingStateOptional.isEmpty() || playingStateOptional.get().getUser().getId() != loggedInUser.getId()) {
            return ResponseEntity.notFound().build();
        }
        var playingState = playingStateOptional.get();
        var quiz = playingState.getQuiz();
        if (playingState.getQuestionNumber() != quiz.getQuestions().size()) {
            return ResponseEntity.badRequest().build();
        }
        var validated = answerValidationService.validateQuiz(loggedInUser, quiz, playingState.getAnswers());

        loggedInUser.getValidatedQuizAnswers().add(validated);
        quiz.getValidatedQuizAnswers().add(validated);

        quizRepository.save(quiz);
        userRepository.save(loggedInUser);
        validatedQuizAnswerRepository.save(validated);
        playingStateRepository.delete(playingState);

        return ResponseEntity.ok(validated);
    }
}
