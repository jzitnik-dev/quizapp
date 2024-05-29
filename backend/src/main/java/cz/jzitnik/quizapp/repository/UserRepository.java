package cz.jzitnik.quizapp.repository;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import cz.jzitnik.quizapp.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword% OR u.displayName LIKE %:keyword%")
  Page<User> findByUsernameOrDisplayName(@Param("keyword") String keyword, Pageable pageable);
}
