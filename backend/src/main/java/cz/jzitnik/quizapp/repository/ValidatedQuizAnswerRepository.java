package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ValidatedQuizAnswerRepository extends JpaRepository<ValidatedQuizAnswer, Long> {
    Optional<ValidatedQuizAnswer> findByUserAndQuiz(User user, Quiz quiz);
}