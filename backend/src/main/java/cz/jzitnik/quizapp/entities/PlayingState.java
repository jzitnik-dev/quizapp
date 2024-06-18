package cz.jzitnik.quizapp.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.jzitnik.quizapp.utils.json.StringListJsonConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.security.SecureRandom;
import java.util.List;

@Entity
@Table(name = "playing_states")
public class PlayingState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    @Column(unique = true)
    private String secretKey;

    @PrePersist
    private void generateSecretKey() {
        if (this.secretKey == null) {
            SecureRandom random = new SecureRandom();
            StringBuilder sb = new StringBuilder();
            String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            int length = 64;
            for (int i = 0; i < length; i++) {
                int index = random.nextInt(characters.length());
                sb.append(characters.charAt(index));
            }
            this.secretKey = sb.toString();
        }
    }

    public @NotNull List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(@NotNull List<String> answers) {
        this.answers = answers;
    }

    public boolean isShowed() {
        return showed;
    }

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonIgnore
    private Quiz quiz;

    @NotNull
    private int questionNumber;

    private boolean showed;

    @NotNull
    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> answers;

    public boolean getShowed() {
        return showed;
    }

    public void setShowed(boolean showed) {
        this.showed = showed;
    }

    @NotNull
    public int getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(@NotNull int questionNumber) {
        this.questionNumber = questionNumber;
    }

    public PlayingState() {
    }

    public PlayingState(User user, Quiz quiz) {
        this.user = user;
        this.quiz = quiz;
        this.questionNumber = 1;
        this.showed = false;
        this.answers = List.of();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
}
