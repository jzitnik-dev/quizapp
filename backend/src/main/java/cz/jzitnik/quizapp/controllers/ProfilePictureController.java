package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/user/profilepicture")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfilePictureController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        var user = userService.getCurrentUser();

        String filePath = "ProfilePictures/" + user.getId();
        String rootPath = System.getProperty("user.dir");
        String fullPath = rootPath + File.separator + filePath;
        File imageFile = new File(fullPath);
        file.transferTo(imageFile);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{username}")
    public ResponseEntity<byte[]> getImageByUsername(@PathVariable String username) throws IOException {
        var user = userRepository.findByUsername(username);

        String rootPath = System.getProperty("user.dir");
        String fullPath = rootPath + File.separator + "ProfilePictures" + File.separator + user.get().getId();

        try {
            byte[] imageData = Files.readAllBytes(Paths.get(fullPath));
            return ResponseEntity.ok().body(imageData);
        } catch (NoSuchFileException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
