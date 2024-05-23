package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.PlayingState;
import cz.jzitnik.quizapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PlayingStateRepository extends JpaRepository<PlayingState, Long> {

    Optional<PlayingState> findBySecretKey(String secretKey);

    Optional<PlayingState> findByUser(User user);
}