package cz.jzitnik.quizapp.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.jzitnik.quizapp.entities.Answer;
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

        var validatedQuizAnswer = new ValidatedQuizAnswer(user, quiz, new ArrayList<Answer>(), true);

        for (int i = 0; i < userAnswers.size(); i++) {
            String userAnswer = userAnswers.get(i);
            Question question = questionList.get(i);
            String quizAnswer = question.getAnswer();
            QuestionType questionType = question.getType();

            if (questionType.equals(QuestionType.Default)) {
                var answer = new Answer(userAnswer, question, convert(userAnswer).equals(convert(quizAnswer)));
                answer.setValidatedQuizAnswer(validatedQuizAnswer);
                validatedQuizAnswer.getAnswers().add(answer);
            } else if (questionType.equals(QuestionType.TrueFalse) || questionType.equals(QuestionType.Singleselect)) {
                var answer = new Answer(userAnswer, question, userAnswer.equals(quizAnswer));
                answer.setValidatedQuizAnswer(validatedQuizAnswer);
                validatedQuizAnswer.getAnswers().add(answer);
            } else if (questionType.equals(QuestionType.Multiselect)) {
                ObjectMapper objectMapper = new ObjectMapper();
                try {
                    var userAns = objectMapper.readValue(userAnswer, List.class);
                    var quizAns = objectMapper.readValue(quizAnswer, List.class);
                    Set<String> userAnsSet = new HashSet<>(userAns);
                    Set<String> quizAnsSet = new HashSet<>(quizAns);
                    var answer = new Answer(quizAnswer, question, userAnsSet.equals(quizAnsSet));
                    answer.setValidatedQuizAnswer(validatedQuizAnswer);
                    validatedQuizAnswer.getAnswers().add(answer);
                } catch(JsonProcessingException e) {
                    var answer = new Answer("[\"Otázka přeskočena\"]", question, false);
                    answer.setValidatedQuizAnswer(validatedQuizAnswer);
                    validatedQuizAnswer.getAnswers().add(answer);
                }
            }
        }

        return validatedQuizAnswer;
    }
}
