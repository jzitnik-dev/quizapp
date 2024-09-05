package cz.jzitnik.quizapp.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.jzitnik.quizapp.utils.json.LongListJsonConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
        })
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  private String displayName;

  @NotBlank
  @Size(max = 120)
  private String password;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(  name = "user_roles",
          joinColumns = @JoinColumn(name = "user_id"),
          inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  @Size(max = 350)
  private String bio;

  @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference(value = "user-quizzes")
  private List<Quiz> quizzes = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private Set<ValidatedQuizAnswer> validatedQuizAnswers = new HashSet<>();

  @NotNull
  @Convert(converter = LongListJsonConverter.class)
  @Column(columnDefinition = "json")
  private List<Long> favourites = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
  @JsonIgnore
  private Set<RefreshToken> refreshTokens = new HashSet<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
  @JsonManagedReference(value = "user-activity")
  private List<Activity> activity = new ArrayList<>();

  @ManyToMany(mappedBy = "likedByUsers")
  @JsonIgnore
  private Set<Comment> likedComments = new HashSet<>();

  public Set<ValidatedQuizAnswer> getValidatedQuizAnswers() {
    return validatedQuizAnswers;
  }

  public void setValidatedQuizAnswers(Set<ValidatedQuizAnswer> validatedQuizAnswers) {
    this.validatedQuizAnswers = validatedQuizAnswers;
  }

  public User() {
  }

  private static String capitalizeFirstLetter(String str) {
    if (str == null || str.isEmpty()) {
      return str;
    }
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

  public User(String username, String password) {
    this.username = username;
    this.password = password;
    this.displayName = capitalizeFirstLetter(username);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  @JsonIgnore
  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public List<Quiz> getQuizzes() {
    return quizzes;
  }

  public void setQuizzes(List<Quiz> quizzes) {
    this.quizzes = quizzes;
  }

  public @NotNull List<Long> getFavourites() {
    return favourites;
  }

  public void setFavourites(@NotNull List<Long> favourites) {
    this.favourites = favourites;
  }

  public List<Activity> getActivity() {
    return activity;
  }

  public void setActivity(List<Activity> activity) {
    this.activity = activity;
  }

  public Set<RefreshToken> getRefreshTokens() {
    return refreshTokens;
  }

  public void setRefreshTokens(Set<RefreshToken> refreshTokens) {
    this.refreshTokens = refreshTokens;
  }

  public Set<Comment> getLikedComments() {
    return likedComments;
  }

  public void setLikedComments(Set<Comment> likedComments) {
    this.likedComments = likedComments;
  }
}
