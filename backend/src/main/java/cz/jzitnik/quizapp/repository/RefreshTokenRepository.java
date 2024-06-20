package cz.jzitnik.quizapp.repository;

import java.util.Optional;

import cz.jzitnik.quizapp.entities.RefreshToken;
import cz.jzitnik.quizapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;


@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    int deleteByUser(User user);
}
