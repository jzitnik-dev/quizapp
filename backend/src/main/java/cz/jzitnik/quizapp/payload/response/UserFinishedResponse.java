package cz.jzitnik.quizapp.payload.response;

public class UserFinishedResponse {
    private int quizCount;
    private int questions;

    public UserFinishedResponse(int quizCount, int questions) {
        this.questions = questions;
        this.quizCount = quizCount;
    }

    public int getQuizCount() {
        return quizCount;
    }

    public void setQuizCount(int quizCount) {
        this.quizCount = quizCount;
    }

    public int getQuestions() {
        return questions;
    }

    public void setQuestions(int questions) {
        this.questions = questions;
    }
}
