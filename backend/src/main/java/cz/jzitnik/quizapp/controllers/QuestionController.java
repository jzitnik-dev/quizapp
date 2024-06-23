package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.Answer;
import cz.jzitnik.quizapp.entities.EActivity;
import cz.jzitnik.quizapp.entities.Question;
import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import cz.jzitnik.quizapp.repository.PlayingStateRepository;
import cz.jzitnik.quizapp.repository.QuizRepository;
import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.repository.ValidatedQuizAnswerRepository;
import cz.jzitnik.quizapp.services.ActivityService;
import cz.jzitnik.quizapp.services.AnswerValidationService;
import cz.jzitnik.quizapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

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

    @Autowired
    private ActivityService activityService;

    @GetMapping("/allquestions")
    public ResponseEntity<List<Question>> getQuestions(@RequestParam("quizId") Long quizId) {
        var quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Question> questionList = new ArrayList<>(quizOptional.get().getQuestions());
        questionList.sort(Comparator.comparingLong(Question::getId));

        return ResponseEntity.ok(questionList);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Question> getQuestion(@RequestParam("key") String key, @RequestParam("question") int question) {
        var playingStateOptional = playingStateRepository.findBySecretKey(key);
        var loggedInUser = userService.getCurrentUser();

        if (playingStateOptional.isEmpty() || !Objects.equals(playingStateOptional.get().getUser().getId(), loggedInUser.getId())) {
            return ResponseEntity.notFound().build();
        }
        var playingState = playingStateOptional.get();
        var quiz = playingState.getQuiz();

        if (playingState.getQuestionNumber() != question || playingState.getShowed()) {
            // Question loaded again. User refreshed webpage.
            var validated = new ValidatedQuizAnswer(loggedInUser, quiz, new ArrayList<Answer>(), false);
            validatedQuizAnswerRepository.save(validated);
            playingStateRepository.delete(playingState);
            activityService.submitActivity(EActivity.QUIZ_PLAY, loggedInUser);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

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
        if (playingStateOptional.isEmpty() || !Objects.equals(playingStateOptional.get().getUser().getId(), loggedInUser.getId())) {
            return ResponseEntity.notFound().build();
        }
        var playingState = playingStateOptional.get();
        var quiz = playingState.getQuiz();

        playingState.getAnswers().add("");

        if (playingState.getQuestionNumber() == quiz.getQuestions().size()) {
            // Finish
            // I have no idea what status code should I use for this. Don't blame me.
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
        }

        playingState.setQuestionNumber(playingState.getQuestionNumber() + 1);
        playingState.setShowed(false);

        playingStateRepository.save(playingState);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/answer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity answer(@RequestParam("key") String key, @RequestBody Map<String, String> body) {
        var answer = body.get("answer");
        var playingStateOptional = playingStateRepository.findBySecretKey(key);
        var loggedInUser = userService.getCurrentUser();
        if (playingStateOptional.isEmpty() || !Objects.equals(playingStateOptional.get().getUser().getId(), loggedInUser.getId())) {
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
        if (playingStateOptional.isEmpty() || !Objects.equals(playingStateOptional.get().getUser().getId(), loggedInUser.getId())) {
            return ResponseEntity.notFound().build();
        }
        var playingState = playingStateOptional.get();
        var quiz = playingState.getQuiz();
        if (playingState.getQuestionNumber() <= quiz.getQuestions().size()) {
            return ResponseEntity.badRequest().build();
        }

        if (quiz.getTimeInMinutes() != null) {
            LocalDateTime endTime = playingState.getStartTime().plusMinutes(quiz.getTimeInMinutes());
            LocalDateTime currentTime = LocalDateTime.now();
            if (currentTime.isAfter(endTime)) {
                // User played longer than is the limit
                var validated = answerValidationService.validateQuiz(loggedInUser, quiz, playingState.getAnswers());

                validatedQuizAnswerRepository.save(validated);
                playingStateRepository.delete(playingState);
                activityService.submitActivity(EActivity.QUIZ_PLAY, loggedInUser);

                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }


        var validated = answerValidationService.validateQuiz(loggedInUser, quiz, playingState.getAnswers());

        validatedQuizAnswerRepository.save(validated);
        playingStateRepository.delete(playingState);

        activityService.submitActivity(EActivity.QUIZ_PLAY, loggedInUser);

        return ResponseEntity.ok(validated);
    }

    @PostMapping("/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity cancel(@RequestParam("key") String key) {
        var playingStateOptional = playingStateRepository.findBySecretKey(key);
        var loggedInUser = userService.getCurrentUser();
        if (playingStateOptional.isEmpty() || !Objects.equals(playingStateOptional.get().getUser().getId(), loggedInUser.getId())) {
            return ResponseEntity.notFound().build();
        }
        var playingState = playingStateOptional.get();
        var quiz = playingState.getQuiz();
        var validated = new ValidatedQuizAnswer(loggedInUser, quiz, new ArrayList<Answer>(), false);
        validatedQuizAnswerRepository.save(validated);
        playingStateRepository.delete(playingState);
        activityService.submitActivity(EActivity.QUIZ_PLAY, loggedInUser);
        return ResponseEntity.ok().build();
    }
}
