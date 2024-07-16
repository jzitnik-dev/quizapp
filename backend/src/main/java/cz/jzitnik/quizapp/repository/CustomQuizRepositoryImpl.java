package cz.jzitnik.quizapp.repository;

import cz.jzitnik.quizapp.entities.Quiz;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.SQLException;
import java.util.Optional;

public class CustomQuizRepositoryImpl implements CustomQuizRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Optional<Quiz> findRandomQuiz() {
        String databaseType = null;
        try {
            databaseType = jdbcTemplate.getDataSource().getConnection().getMetaData().getDatabaseProductName();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        String query;
        if (databaseType.equalsIgnoreCase("MySQL")) {
            query = "SELECT * FROM quizzes ORDER BY RAND() LIMIT 1";
        } else if (databaseType.equalsIgnoreCase("PostgreSQL") || databaseType.equalsIgnoreCase("SQLite")) {
            query = "SELECT * FROM quizzes ORDER BY RANDOM() LIMIT 1";
        } else if (databaseType.equalsIgnoreCase("Oracle")) {
            query = "SELECT * FROM quizzes ORDER BY DBMS_RANDOM.VALUE FETCH FIRST 1 ROWS ONLY";
        } else if (databaseType.equalsIgnoreCase("Microsoft SQL Server")) {
            query = "SELECT * FROM quizzes TABLESAMPLE SYSTEM (1) FETCH FIRST 1 ROWS ONLY";
        } else {
            throw new UnsupportedOperationException("Unsupported database type: " + databaseType);
        }

        return Optional.ofNullable((Quiz) entityManager.createNativeQuery(query, Quiz.class).getSingleResult());
    }
}
