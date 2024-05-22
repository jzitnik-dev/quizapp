package cz.jzitnik.quizapp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String question;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private QuestionType type;

    private String options;

    @NotBlank
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonBackReference
    private Quiz quiz;

    public Question() {

    }

    public Question(Long id, String question, QuestionType type, String options, String answer, Quiz quiz) {
        this.id = id;
        this.question = question;
        this.type = type;
        this.options = options;
        this.answer = answer;
        this.quiz = quiz;
    }

    public Long getId() {
        return id;
    }

    public @NotBlank String getQuestion() {
        return question;
    }

    public QuestionType getType() {
        return type;
    }

    @Nullable
    public String getOptions() {
        return options;
    }

    public @NotBlank String getAnswer() {
        return answer;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuestion(@NotBlank String question) {
        this.question = question;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }

    public void setOptions(@Nullable String options) {
        this.options = options;
    }

    public void setAnswer(@NotBlank String answer) {
        this.answer = answer;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
}
