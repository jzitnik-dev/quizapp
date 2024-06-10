package cz.jzitnik.quizapp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String answer;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    private boolean correct;

    @ManyToOne
    @JoinColumn(name = "validated_quiz_answer_id", nullable = false)
    @JsonBackReference
    private ValidatedQuizAnswer validatedQuizAnswer;

    public ValidatedQuizAnswer getValidatedQuizAnswer() {
        return validatedQuizAnswer;
    }

    public void setValidatedQuizAnswer(ValidatedQuizAnswer validatedQuizAnswer) {
        this.validatedQuizAnswer = validatedQuizAnswer;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Answer() {
    }

    public Answer(String answer, Question question, boolean correct) {
        this.answer = answer;
        this.correct = correct;
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}
