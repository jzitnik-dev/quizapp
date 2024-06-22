package cz.jzitnik.quizapp.services;

import cz.jzitnik.quizapp.entities.Activity;
import cz.jzitnik.quizapp.entities.EActivity;
import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {
    @Autowired
    ActivityRepository activityRepository;

    public Activity submitActivity(EActivity type, User user) {
        var activity = new Activity(type, user);
        return activityRepository.save(activity);
    }
}
