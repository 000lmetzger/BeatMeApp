package de.beatme.group;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.storage.Bucket;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import de.beatme.logging.LogController;
import de.beatme.user.User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class GroupService {

    public CreateGroupResponse createNewGroup(CreateGroupRequest createGroupRequest, MultipartFile groupPic) {
        try {
            UserRecord groupOwner = FirebaseAuth.getInstance().getUser(createGroupRequest.getOwnerID());

            List<User> members = new ArrayList<>(createGroupRequest.getUserList() != null ? createGroupRequest.getUserList() : new ArrayList<>());

            boolean ownerAlreadyIncluded = members.stream()
                    .anyMatch(u -> u.getUid().equals(groupOwner.getUid()));
            if (!ownerAlreadyIncluded) {
                members.add(new User(groupOwner.getUid(), groupOwner.getEmail(), groupOwner.getDisplayName(), groupOwner.getEmail()));
            }

            String groupId = UUID.randomUUID().toString();
            String inviteId = generateInviteId();

            String groupUrl = null;
            if (groupPic != null && !groupPic.isEmpty()) {
                String contentType = groupPic.getContentType();
                if (contentType != null && contentType.startsWith("image/")) {
                    groupUrl = uploadGroupPicture(groupId, groupPic.getBytes());
                } else {
                    throw new IllegalArgumentException("Only images are supported (jpg, png, ...)");
                }
            }

            Firestore db = FirestoreClient.getFirestore();
            assert groupUrl != null;
            Map<String, Object> groupData = Map.of(
                    "groupId", groupId,
                    "inviteID", inviteId,
                    "groupName", createGroupRequest.getGroupName(),
                    "ownerId", groupOwner.getUid(),
                    "members", members,
                    "challengeList", Optional.ofNullable(createGroupRequest.getChallengeList()).orElse(List.of()),
                    "timer", createGroupRequest.getTimer(),
                    "groupPicture", groupUrl
            );

            db.collection("groups").document(groupId).set(groupData).get();

            return new CreateGroupResponse(groupId, inviteId, createGroupRequest.getGroupName(), members, groupUrl);

        } catch (Exception e) {
            LogController.logError("Group could not be created: " + e.getMessage());
            throw new RuntimeException("Error when creating group", e);
        }
    }

    private String generateInviteId() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder("#");
        Random rnd = new Random();
        for (int i = 0; i < 5; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public String uploadGroupPicture(String groupId, byte[] fileBytes) throws Exception {
        Bucket bucket = StorageClient.getInstance().bucket();

        String fileName = "groups/" + groupId + "/group.jpg";
        bucket.create(fileName, fileBytes, "image/jpeg");

        return "https://firebasestorage.googleapis.com/v0/b/"
                + bucket.getName()
                + "/o/"
                + fileName.replace("/", "%2F")
                + "?alt=media";
    }
}
