package cz.jzitnik.quizapp.payload.response;

import java.util.List;

public class QuizStatsResponse {
    private List<String> questions;

    private List<Integer> percentages;

    private List<Integer> plays;

    public QuizStatsResponse() {
    }

    public QuizStatsResponse(List<String> questions, List<Integer> percentages, List<Integer> plays) {
        this.questions = questions;
        this.percentages = percentages;
        this.plays = plays;
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

    public List<Integer> getPlays() {
        return plays;
    }

    public void setPlays(List<Integer> plays) {
        this.plays = plays;
    }
}
