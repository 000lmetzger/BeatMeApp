package de.beatme.group;

import de.beatme.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CreateGroupResponse {
    private String groupId;
    private String inviteId;
    private String groupName;
    private List<User> members;
    private String groupUrl;
}

