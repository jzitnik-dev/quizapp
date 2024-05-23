package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ValidatedQuizAnswerRepository extends JpaRepository<ValidatedQuizAnswer, Long> {

}