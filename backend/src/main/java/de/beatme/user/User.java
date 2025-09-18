package de.beatme.user;

import lombok.Data;

@Data
public class User {
    private String username;
    private String profilePicture;
    private String email;
    private String password;
}
