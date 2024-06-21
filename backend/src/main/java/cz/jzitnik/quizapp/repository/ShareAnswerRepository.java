package cz.jzitnik.quizapp.repository;

import java.util.List;
import java.util.Optional;

import cz.jzitnik.quizapp.entities.ShareAnswer;
import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShareAnswerRepository extends JpaRepository<ShareAnswer, Long> {
    Optional<ShareAnswer> findByShareKey(String shareKey);
    Optional<ShareAnswer> findByValidatedQuizAnswer(ValidatedQuizAnswer validatedQuizAnswer);
    List<ShareAnswer> findByUser(User user);
}