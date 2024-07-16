package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.Quiz;

import java.util.Optional;

public interface CustomQuizRepository {
    Optional<Quiz> findRandomQuiz();
}