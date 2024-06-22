package cz.jzitnik.quizapp.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentRequest {
    @NotBlank
    @Size(min = 5, max = 500)
    private String content;

    private Long quizId;

    public @NotBlank String getContent() {
        return content;
    }

    public void setContent(@NotBlank String request) {
        this.content = request;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public CommentRequest(String content, Long quizId) {
        this.content = content;
        this.quizId = quizId;
    }
}
