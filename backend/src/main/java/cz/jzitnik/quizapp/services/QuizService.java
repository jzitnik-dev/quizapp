package cz.jzitnik.quizapp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.repository.QuizRepository;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    /*public Page<Quiz> getAllQuizzes(int page, int size, Integer questionCount, String sortType) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if (questionCount != null) {
            return quizRepository.findByNumberOfQuestions(questionCount, pageable);
        } else {
            return quizRepository.findAll(pageable);
        }
    }*/


    public Page<Quiz> getAllQuizzes(int page, int size, Integer questionCount, String sortType) {
        Sort sort = Sort.by("id").descending(); // Default sort

        if (sortType != null) {
            switch (sortType.toLowerCase()) {
                case "title":
                    sort = Sort.by("title").ascending();
                    break;
                case "likes":
                    sort = Sort.by("likes").descending();
                    break;
                case "time":
                    sort = Sort.by("timeInMinutes").ascending();
                    break;
                default:
                    break;
            }
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        if (questionCount != null) {
            return quizRepository.findByNumberOfQuestions(questionCount, pageable);
        } else {
            return quizRepository.findAll(pageable);
        }
    }
}
