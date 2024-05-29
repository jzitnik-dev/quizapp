package cz.jzitnik.quizapp.services;

import cz.jzitnik.quizapp.entities.Quiz;
import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.repository.QuizRepository;
import cz.jzitnik.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    public Page<Object> searchUsersAndQuizzes(String keyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<User> userPage = userRepository.findByUsernameOrDisplayName(keyword, pageRequest);
        Page<Quiz> quizPage = quizRepository.findByTitle(keyword, pageRequest);

        List<Object> combinedResults = new ArrayList<>();
        combinedResults.addAll(userPage.getContent());
        combinedResults.addAll(quizPage.getContent());

        int totalElements = (int) (userPage.getTotalElements() + quizPage.getTotalElements());
        return new PageImpl<>(combinedResults, pageRequest, totalElements);
    }
}