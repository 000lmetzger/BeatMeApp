package de.beatme.group;

import de.beatme.challenge.Challenge;
import de.beatme.user.User;
import lombok.Data;
import java.awt.*;
import java.util.List;

@Data
public class CreateGroupRequest {
    String inviteID;
    String groupName;
    Image icon;
    List<User> userList;
    List<Challenge>  challengeList;
    Integer timer;
}
