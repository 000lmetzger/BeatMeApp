package de.beatme.group;

import de.beatme.challenge.Challenge;
import de.beatme.user.User;
import lombok.Data;
import java.util.List;

@Data
public class CreateGroupRequest {
    private String groupName;
    private List<User> userList;
    private Integer timer;
    private String ownerID;
    private List<Challenge> challengeList;
}
