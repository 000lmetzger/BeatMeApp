package de.beatme.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateUserResponse {
    private String uid;
    private String username;
    private String email;
    private String profilePicture;
}
