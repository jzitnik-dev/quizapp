package cz.jzitnik.quizapp.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "quizzes")
@JsonIgnoreProperties(value = { "comments" }, allowGetters = true)
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

    private int timeInMinutes;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
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
    private Set<ValidatedQuizAnswer> validatedQuizAnswers = new HashSet<>();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<QuizView> views = new HashSet<>();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<PlayingState> playingStates = new HashSet<>();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<ShareAnswer> shareAnswers = new HashSet<>();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.REMOVE)
    @JsonManagedReference(value = "quiz-comments")
    private List<Comment> comments = new ArrayList<>();

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "activity_id")
    @JsonIgnore
    private Activity linkedActivity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-quizzes")
    private User author;

    private int likes = 0;

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

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

    public Set<QuizView> getViews() {
        return views;
    }

    public void setViews(Set<QuizView> views) {
        this.views = views;
    }

    public Set<PlayingState> getPlayingStates() {
        return playingStates;
    }

    public void setPlayingStates(Set<PlayingState> playingStates) {
        this.playingStates = playingStates;
    }

    public Set<ShareAnswer> getShareAnswers() {
        return shareAnswers;
    }

    public void setShareAnswers(Set<ShareAnswer> shareAnswers) {
        this.shareAnswers = shareAnswers;
    }

    public int getTotalViews() {
        return views.stream().mapToInt(QuizView::getViews).sum();
    }

    public int getTotalPlays() {
        return validatedQuizAnswers.size();
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public Activity getLinkedActivity() {
        return linkedActivity;
    }

    public void setLinkedActivity(Activity linkedActivity) {
        this.linkedActivity = linkedActivity;
    }

    public Integer getTimeInMinutes() {
        return timeInMinutes;
    }

    public void setTimeInMinutes(Integer timeInMinutes) {
        this.timeInMinutes = timeInMinutes;
    }
}
