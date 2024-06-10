package cz.jzitnik.quizapp.entities;

import jakarta.persistence.*;
import java.util.Random;

@Entity
public class ShareAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(unique = true)
    private ValidatedQuizAnswer validatedQuizAnswer;

    @Column(unique = true)
    private String shareKey;

    @ManyToOne
    @JoinColumn
    private User user;

    @ManyToOne
    @JoinColumn
    private Quiz quiz;

    public ShareAnswer(ValidatedQuizAnswer validatedQuizAnswer, User user, Quiz quiz) {
        this.validatedQuizAnswer = validatedQuizAnswer;

        final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        final int STRING_LENGTH = 30;

        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder(STRING_LENGTH);

        for (int i = 0; i < STRING_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            stringBuilder.append(CHARACTERS.charAt(randomIndex));
        }

        this.shareKey = stringBuilder.toString();
        this.user = user;
        this.quiz = quiz;
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

    public ShareAnswer() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ValidatedQuizAnswer getValidatedQuizAnswer() {
        return validatedQuizAnswer;
    }

    public void setValidatedQuizAnswer(ValidatedQuizAnswer validatedQuizAnswer) {
        this.validatedQuizAnswer = validatedQuizAnswer;
    }

    public String getShareKey() {
        return shareKey;
    }

    public void setShareKey(String shareKey) {
        this.shareKey = shareKey;
    }
}
