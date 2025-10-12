package de.beatme.user;

import de.beatme.logging.LogController;
import lombok.extern.java.Log;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Log
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createUser(@RequestPart("user") CreateUserRequest userRequest,
                                        @RequestPart(value = "profilePic", required = false) MultipartFile profilePic) {
        try {
            var response = userService.createNewUser(userRequest, profilePic);
            LogController.logSuccess("User successfully created");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LogController.logError("User could not be created - ERROR MESSAGE: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
