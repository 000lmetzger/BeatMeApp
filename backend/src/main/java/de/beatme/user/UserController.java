package de.beatme.user;

import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public boolean createUser(@RequestBody CreateUserRequest userRequest) {
        try {
            userService.createNewUser(userRequest);
        } catch (Exception e) {
            log.warning("User could not be created - ERROR MESSAGE: " + e.getMessage());
            return false;
        }
        return true;
    }
}
