package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.GlobalMessage;
import cz.jzitnik.quizapp.payload.response.MessageResponse;
import cz.jzitnik.quizapp.repository.GlobalMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping("/globalMessages")
    @PreAuthorize("isAuthenticated() and hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> setGlobalMessages(@RequestBody List<GlobalMessage> globalMessagesRequest) {
        globalMessageRepository.deleteAll();
        globalMessageRepository.flush();

        globalMessageRepository.saveAll(globalMessagesRequest);
        globalMessageRepository.flush();

        return ResponseEntity.ok(new MessageResponse("Done!"));
    }

    @Value("${jzitnik.app.disableProfilePictureUpload}")
    private String disablePPUpload;

    @GetMapping("/config/uploadAllowed")
    public ResponseEntity<Boolean> getUploadAllowed() {
        return ResponseEntity.ok(!disablePPUpload.equals("true"));
    }

    @Value("${jzitnik.app.disableRegister}")
    private String disableRegister;

    @GetMapping("/config/registerAllowed")
    public ResponseEntity<Boolean> getRegisterAllowed() {
        return ResponseEntity.ok(!disableRegister.equals("true"));
    }
}
