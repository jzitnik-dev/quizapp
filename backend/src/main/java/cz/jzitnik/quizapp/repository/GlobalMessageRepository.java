package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.GlobalMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalMessageRepository extends JpaRepository<GlobalMessage, Long> {

}
