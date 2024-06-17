package cz.jzitnik.quizapp.services;

import cz.jzitnik.quizapp.entities.Question;
import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import cz.jzitnik.quizapp.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizRecommendationService {
    // This code is shit as hell. It even doesn't work properly so not used rn. Need to rewrite it all.

    @Autowired
    private QuizRepository quizRepository;

    public List<Quiz> getDiscovery(User user) {
        Set<ValidatedQuizAnswer> validatedQuizAnswers = user.getValidatedQuizAnswers();
        Set<Quiz> playedQuizzes = validatedQuizAnswers.stream().map(ValidatedQuizAnswer::getQuiz).collect(Collectors.toSet());
        Set<Long> playedQuizzesId = playedQuizzes.stream().map(Quiz::getId).collect(Collectors.toSet());

        if (playedQuizzesId.size() == 0) {
            return quizRepository.findAll();
        }

        Set<ValidatedQuizAnswer> successfulQuizzes = validatedQuizAnswers.stream().filter(validatedQuizAnswer ->
                (validatedQuizAnswer.getAnswers().stream().filter(answer -> answer.isCorrect()).collect(Collectors.toSet()).size() / validatedQuizAnswer.getAnswers().size()) > 0.85
        ).collect(Collectors.toSet());

        Set<ValidatedQuizAnswer> unsuccessfulQuizzes = validatedQuizAnswers.stream().filter(validatedQuizAnswer ->
                (validatedQuizAnswer.getAnswers().stream().filter(answer -> answer.isCorrect()).collect(Collectors.toSet()).size() / validatedQuizAnswer.getAnswers().size()) <= 0.85
        ).collect(Collectors.toSet());

        List<Quiz> unPlayedQuizzes = quizRepository.findAll().stream().filter(quiz -> playedQuizzesId.contains(quiz.getId())).toList();

        return unPlayedQuizzes.stream()
                .filter(quiz -> isSimilarToAny(quiz, successfulQuizzes.stream().map(ValidatedQuizAnswer::getQuiz).collect(Collectors.toSet())) && !isSimilarToAny(quiz, unsuccessfulQuizzes.stream().map(ValidatedQuizAnswer::getQuiz).collect(Collectors.toSet())))
                .sorted(Comparator.comparingInt(Quiz::getTotalViews).reversed())
                .collect(Collectors.toList());
    }

    private boolean isSimilarToAny(Quiz quiz, Set<Quiz> otherQuizzes) {
        for (Quiz otherQuiz : otherQuizzes) {
            if (calculateSimilarity(quiz, otherQuiz) > 0.3) { // threshold for similarity
                return true;
            }
        }
        return false;
    }

    public static double calculateSimilarity(Quiz quiz1, Quiz quiz2) {
        Set<String> set1 = new HashSet<>(Arrays.asList((quiz1.getTitle() + " " + quiz1.getDescription() + " " + String.join(" ", quiz1.getQuestions().stream().map(Question::getQuestion).toList())).split("\\s+")));
        Set<String> set2 = new HashSet<>(Arrays.asList((quiz2.getTitle() + " " + quiz2.getDescription() + " " + String.join(" ", quiz2.getQuestions().stream().map(Question::getQuestion).toList())).split("\\s+")));

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }
}
