package cz.jzitnik.quizapp.controllers;


import cz.jzitnik.quizapp.entities.Comment;
import cz.jzitnik.quizapp.entities.EActivity;
import cz.jzitnik.quizapp.payload.request.CommentRequest;
import cz.jzitnik.quizapp.repository.*;
import cz.jzitnik.quizapp.services.ActivityService;
import cz.jzitnik.quizapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quiz/comment")
public class CommentController {
    @Autowired
    private UserService userService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private CommentRepository commentRepository;

    @GetMapping("/liked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isLiked(@RequestParam("commentId") Long commentId) {
        var loggedUser = userService.getCurrentUser();
        var comment = commentRepository.findById(commentId);

        if (comment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(loggedUser.getLikedComments().stream().anyMatch(c -> c.getId().equals(comment.get().getId())));
    }

    @PostMapping("/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> like(@RequestParam("commentId") Long commentId) {
        var loggedUser = userService.getCurrentUser();
        var commentOptional = commentRepository.findById(commentId);

        if (commentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var comment = commentOptional.get();
        boolean liked = loggedUser.getLikedComments().contains(comment);

        if (liked) {
            comment.getLikedByUsers().remove(loggedUser);
        } else {
            comment.getLikedByUsers().add(loggedUser);
        }

        commentRepository.save(comment);

        return ResponseEntity.ok(!liked);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity comment(@RequestBody CommentRequest commentRequest) {
        var loggedUser = userService.getCurrentUser();
        var quizOptional = quizRepository.findById(commentRequest.getQuizId());
        if (quizOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (quizOptional.get().getAuthor().getUsername().equals(loggedUser.getUsername())) {
            return ResponseEntity.badRequest().build();
        }
        var comment = commentRepository.findByAuthorAndQuiz(loggedUser, quizOptional.get());

        if (comment.isPresent()) {
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
        }

        var activity = activityService.submitActivity(EActivity.COMMENT_CREATE, loggedUser);

        var newComment = new Comment(quizOptional.get(), loggedUser, commentRequest.getContent(), activity);
        commentRepository.save(newComment);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@RequestParam("quizId") Long quizId) {
        var loggedUser = userService.getCurrentUser();
        var quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var commentOptional = commentRepository.findByAuthorAndQuiz(loggedUser, quizOptional.get());

        if (commentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        commentRepository.delete(commentOptional.get());

        return ResponseEntity.ok().build();
    }
}