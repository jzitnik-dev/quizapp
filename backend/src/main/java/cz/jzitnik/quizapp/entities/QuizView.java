package cz.jzitnik.quizapp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;

@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"date", "quiz_id"})})
public class QuizView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonBackReference(value = "quiz-validatedQuizAnswers")
    private Quiz quiz;

    private LocalDate date;

    private int views;

    public QuizView(Quiz quiz) {
        this.quiz = quiz;
        this.date = LocalDate.now();
        this.views = 1;
    }

    public QuizView() {
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
