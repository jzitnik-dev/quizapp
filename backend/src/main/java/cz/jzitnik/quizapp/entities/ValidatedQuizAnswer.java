package cz.jzitnik.quizapp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "quiz_id"})})
public class ValidatedQuizAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonBackReference(value = "quiz-validatedQuizAnswers")
    private Quiz quiz;

    @NotNull
    @OneToMany(mappedBy = "validatedQuizAnswer", cascade = {CascadeType.ALL, CascadeType.REMOVE})
    @JsonManagedReference
    private List<Answer> answers;

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    private boolean finished;

    private LocalDate createDate;

    public ValidatedQuizAnswer(User user, Quiz quiz, ArrayList<Answer> answers, boolean finished) {
        this.user = user;
        this.quiz = quiz;
        this.finished = finished;
        this.answers = answers;
        this.createDate = LocalDate.now();
    }

    public ValidatedQuizAnswer() {
    }

    public @NotNull List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(@NotNull List<Answer> answers) {
        this.answers = answers;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }
}
