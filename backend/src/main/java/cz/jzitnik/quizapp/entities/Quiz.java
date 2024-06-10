package cz.jzitnik.quizapp.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "quizzes")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String title;

    @NotBlank
    @Size(max = 500)
    private String description;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "quiz-questions")
    private List<Question> questions = new ArrayList<>();

    public Set<ValidatedQuizAnswer> getValidatedQuizAnswers() {
        return validatedQuizAnswers;
    }

    public void setValidatedQuizAnswers(Set<ValidatedQuizAnswer> validatedQuizAnswers) {
        this.validatedQuizAnswers = validatedQuizAnswers;
    }

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.REMOVE)
    @JsonManagedReference(value = "quiz-validatedQuizAnswers")
    @JsonIgnore
    private Set<ValidatedQuizAnswer> validatedQuizAnswers;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonBackReference // Prevents infinite recursion when serializing to JSON
    private User author;

    private LocalDateTime createDate;

    public Quiz() {
    }

    public Quiz(String title, String description) {
        this.title = title;
        this.description = description;
        this.createDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User user) {
        this.author = user;
    }
}
