package cz.jzitnik.quizapp.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.jzitnik.quizapp.entities.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnswerValidationService {
    private String convert(String answer) {
        return answer.replaceAll("[^\\p{ASCII}]", "").toLowerCase().trim();
    }
    public ValidatedQuizAnswer validateQuiz(User user, Quiz quiz, List<String> userAnswers) {
        var questionsSet = quiz.getQuestions();
        List<Question> questionList = new ArrayList<>(questionsSet);
        questionList.sort(Comparator.comparingLong(Question::getId));

        List<String> correctAnswers = new ArrayList<>();
        List<String> wrongAnswers = new ArrayList<>();

        for (int i = 0; i < userAnswers.size(); i++) {
            String userAnswer = userAnswers.get(i);
            Question question = questionList.get(i);
            String quizAnswer = question.getAnswer();
            QuestionType questionType = question.getType();

            if (questionType.equals(QuestionType.Default)) {
                if (convert(userAnswer).equals(convert(quizAnswer))) {
                    correctAnswers.add(quizAnswer);
                } else {
                    wrongAnswers.add(quizAnswer);
                }
            } else if (questionType.equals(QuestionType.TrueFalse) || questionType.equals(QuestionType.Singleselect)) {
                if (userAnswer.equals(quizAnswer)) {
                    correctAnswers.add(quizAnswer);
                } else {
                    wrongAnswers.add(quizAnswer);
                }
            } else if (questionType.equals(QuestionType.Multiselect)) {
                ObjectMapper objectMapper = new ObjectMapper();
                try {
                    var userAns = objectMapper.readValue(quizAnswer, List.class);
                    var quizAns = objectMapper.readValue(quizAnswer, List.class);
                    Set<String> userAnsSet = new HashSet<>(userAns);
                    Set<String> quizAnsSet = new HashSet<>(quizAns);
                    if (userAnsSet.equals(quizAnsSet)) {
                        correctAnswers.add(quizAnswer);
                    } else {
                        wrongAnswers.add(quizAnswer);
                    }
                } catch(JsonProcessingException e) {
                    wrongAnswers.add("[\"Interní chyba\"]");
                }
            }
        }


        var validatedQuizAnswer = new ValidatedQuizAnswer(user, quiz, correctAnswers, wrongAnswers, userAnswers, true);

        return validatedQuizAnswer;
    }
}
