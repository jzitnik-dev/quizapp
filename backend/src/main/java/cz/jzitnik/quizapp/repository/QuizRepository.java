package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;


@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    @Query("SELECT q FROM Quiz q WHERE SIZE(q.questions) = ?1")
    Page<Quiz> findByNumberOfQuestions(int numberOfQuestions, Pageable pageable);

    @Query("SELECT q FROM Quiz q WHERE q.title LIKE %:keyword%")
    Page<Quiz> findByTitle(@Param("keyword") String keyword, Pageable pageable);
}
