package cz.jzitnik.quizapp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Quiz quiz;

    private String content;

    @ManyToOne
    @JsonManagedReference
    private User author;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "activity_id")
    @JsonIgnore
    private Activity linkedActivity;

    private LocalDate date;

    public Comment() {

    }

    public Comment(Quiz quiz, User author, String content, Activity linkedActivity) {
        this.quiz = quiz;
        this.author = author;
        this.content = content;
        this.date = LocalDate.now();
        this.linkedActivity = linkedActivity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Activity getLinkedActivity() {
        return linkedActivity;
    }

    public void setLinkedActivity(Activity linkedActivity) {
        this.linkedActivity = linkedActivity;
    }
}
