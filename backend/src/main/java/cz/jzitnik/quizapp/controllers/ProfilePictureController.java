package cz.jzitnik.quizapp.controllers;

import cz.jzitnik.quizapp.entities.User;
import cz.jzitnik.quizapp.payload.response.MessageResponse;
import cz.jzitnik.quizapp.repository.UserRepository;
import cz.jzitnik.quizapp.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/profilepicture")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfilePictureController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Value("${jzitnik.app.disableProfilePictureUpload}")
    private String disablePPUpload;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (disablePPUpload.equals("true")) {
            return ResponseEntity.badRequest().body(new MessageResponse("Nahrávání profilových obrázků je zakázano administrátorem!"));
        }

        var user = userService.getCurrentUser();

        String filePath = "ProfilePictures/" + user.getId();
        String rootPath = System.getProperty("user.dir");
        String fullPath = rootPath + File.separator + filePath;
        File imageFile = new File(fullPath);
        file.transferTo(imageFile);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{username}")
    public void getImageByUsername(@PathVariable String username, HttpServletResponse response) throws IOException {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            response.setStatus(HttpStatus.NOT_FOUND.value());
            return;
        }

        User user = userOptional.get();
        String rootPath = System.getProperty("user.dir");
        Path imagePath = Paths.get(rootPath, "ProfilePictures", String.valueOf(user.getId()));

        if (Files.exists(imagePath)) {
            Files.copy(imagePath, response.getOutputStream());
            response.getOutputStream().flush();
        } else {
            response.setStatus(HttpStatus.NOT_FOUND.value());
        }
    }
}
