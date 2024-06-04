package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.entities.QuizView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface QuizViewRepository extends JpaRepository<QuizView, Long> {
    Optional<QuizView> findByQuizAndDate(Quiz quiz, LocalDate date);
}