package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ValidatedQuizAnswerRepository extends JpaRepository<ValidatedQuizAnswer, Long> {
    Optional<ValidatedQuizAnswer> findByUserAndQuiz(User user, Quiz quiz);
    List<ValidatedQuizAnswer> findByQuizAndFinishedIsTrue(Quiz quiz);
    List<ValidatedQuizAnswer> findByQuizAndCreateDate(Quiz quiz, LocalDate createDate);
    List<ValidatedQuizAnswer> findByUserAndFinishedIsTrueOrderByIdDesc(User user);
}