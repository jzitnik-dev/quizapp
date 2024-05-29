package cz.jzitnik.quizapp.services;

import cz.jzitnik.quizapp.controllers.Answer;
import cz.jzitnik.quizapp.entities.Question;
import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.entities.ValidatedQuizAnswer;
import cz.jzitnik.quizapp.payload.response.QuizStatsResponse;
import cz.jzitnik.quizapp.repository.ValidatedQuizAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuizStatsService {
    @Autowired
    private ValidatedQuizAnswerRepository validatedQuizAnswerRepository;

    private String findQuestionByAnswer(Set<Question> questions, String answer) {
        for (Question question : questions) {
            if (question.getAnswer().equals(answer)) {
                return question.getQuestion();
            }
        }
        return null;
    }

    public Optional<QuizStatsResponse> getStats(Quiz quiz) {
        // I know this code is shit as hell. But you know if it works don't touch it.
        var validatedQuizAnswers = validatedQuizAnswerRepository.findByQuizAndFinishedIsTrue(quiz);

        if (validatedQuizAnswers.isEmpty()) {
            return Optional.empty();
        }

        Map<String, Map<String, Integer>> data = new HashMap<>();

        var questions = quiz.getQuestions();

        List<Question> questionList = new ArrayList<>(questions);
        questionList.sort(Comparator.comparingLong(Question::getId));

        for (Question question : questionList) {
            Map<String, Integer> innerMap = new HashMap<>();
            innerMap.put("correct", 0);
            innerMap.put("wrong", 0);
            data.put(question.getQuestion(), innerMap);
        }

        for (ValidatedQuizAnswer validatedQuizAnswer : validatedQuizAnswers) {
            for (Answer answer : validatedQuizAnswer.getAnswers()) {
                if (answer.isCorrect()) {
                    var now = data.get(answer.getQuestion()).get("correct");
                    now++;
                    data.get(answer.getQuestion()).put("correct", now);
                } else {
                    var now = data.get(answer.getQuestion()).get("wrong");
                    now++;
                    data.get(answer.getQuestion()).put("wrong", now);
                }
            }

        }

        List<String> finalQuestions = questionList.stream().map(Question::getQuestion).toList();
        List<Integer> percentages = new ArrayList<>();

        for (String question : finalQuestions) {
            var questionTemp = data.get(question);
            var correct = questionTemp.get("correct");
            var wrong = questionTemp.get("wrong");
            int successPercentage = (int) (((double) correct / (correct + wrong)) * 100);
            percentages.add(successPercentage);
        }

        var finalResponse = new QuizStatsResponse(finalQuestions, percentages);
        return Optional.of(finalResponse);
    }
}
