package cz.jzitnik.quizapp.payload.response;

import java.util.List;

public class QuizStatsResponse {
    private List<String> questions;

    private List<Integer> percentages;

    public QuizStatsResponse() {
    }

    public QuizStatsResponse(List<String> questions, List<Integer> percentages) {
        this.questions = questions;
        this.percentages = percentages;
    }

    public List<String> getQuestions() {
        return questions;
    }

    public void setQuestions(List<String> questions) {
        this.questions = questions;
    }

    public List<Integer> getPercentages() {
        return percentages;
    }

    public void setPercentages(List<Integer> percentages) {
        this.percentages = percentages;
    }
}
