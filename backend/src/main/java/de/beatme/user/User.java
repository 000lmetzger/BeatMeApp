package de.beatme.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
    private String uid;
    private String username;
    private String email;
    private String profilePicture;
}

