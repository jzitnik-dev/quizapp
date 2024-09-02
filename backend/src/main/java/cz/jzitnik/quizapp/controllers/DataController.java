package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.GlobalMessage;
import cz.jzitnik.quizapp.repository.GlobalMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/data")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DataController {
    @Autowired
    private GlobalMessageRepository globalMessageRepository;

    @GetMapping("/globalMessages")
    public ResponseEntity<List<GlobalMessage>> getGlobalMessages() {
        return ResponseEntity.ok(globalMessageRepository.findAll());
    }
}
