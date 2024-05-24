package cz.jzitnik.quizapp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import cz.jzitnik.quizapp.utils.JsonConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
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
    @Convert(converter = JsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> correctAnswers;

    @NotNull
    @Convert(converter = JsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> wrongAnswers;

    @NotNull
    @Convert(converter = JsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> allUserAnswers;

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    private boolean finished;

    public ValidatedQuizAnswer(User user, Quiz quiz, List<String> correctAnswers, List<String> wrongAnswers, List<String> allUserAnswers, boolean finished) {
        this.user = user;
        this.quiz = quiz;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
        this.allUserAnswers = allUserAnswers;
        this.finished = finished;
    }

    public ValidatedQuizAnswer() {
    }

    public @NotNull List<String> getAllUserAnswers() {
        return allUserAnswers;
    }

    public void setAllUserAnswers(@NotNull List<String> allUserAnswers) {
        this.allUserAnswers = allUserAnswers;
    }

    public @NotNull List<String> getWrongAnswers() {
        return wrongAnswers;
    }

    public void setWrongAnswers(@NotNull List<String> wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }

    public @NotNull List<String> getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(@NotNull List<String> correctAnswers) {
        this.correctAnswers = correctAnswers;
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
}
