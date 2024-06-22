package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.Comment;
import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findByAuthorAndQuiz(User author, Quiz quiz);
}
