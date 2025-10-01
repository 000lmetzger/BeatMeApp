package de.beatme.group;

import com.google.cloud.firestore.*;
import com.google.cloud.storage.Bucket;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import de.beatme.logging.LogController;
import de.beatme.user.User;
import de.beatme.voting.ResultEntry;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class GroupService {

    public CreateGroupResponse createNewGroup(CreateGroupRequest createGroupRequest, MultipartFile groupPic) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            UserRecord groupOwner = FirebaseAuth.getInstance().getUser(createGroupRequest.getOwnerID());
            String ownerUid = groupOwner.getUid();

            DocumentSnapshot userDoc = db.collection("users").document(ownerUid).get().get();
            User ownerUser;
            if (userDoc.exists()) {
                ownerUser = userDoc.toObject(User.class);
            } else {
                ownerUser = new User(ownerUid,
                        groupOwner.getDisplayName() != null ? groupOwner.getDisplayName() : "Unknown",
                        groupOwner.getEmail(),
                        groupOwner.getPhotoUrl() != null ? groupOwner.getPhotoUrl() : null);
            }

            List<User> groupMembers = new ArrayList<>();
            groupMembers.add(ownerUser);

            String groupId = UUID.randomUUID().toString();
            String inviteId = generateInviteId();

            String groupUrl;

            if (groupPic == null || groupPic.isEmpty()) {
                groupUrl = "https://firebasestorage.googleapis.com/v0/b/"
                        + StorageClient.getInstance().bucket().getName()
                        + "/o/groups%2Fdefault%2Fstandart-group-icon.png?alt=media";
            } else {
                String contentType = groupPic.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new IllegalArgumentException("Only images are supported (jpg, png, ...)");
                }
                groupUrl = uploadGroupPicture(groupId, groupPic.getBytes());
            }

            Map<String, Object> groupData = new HashMap<>();

            groupData.put("groupId", groupId);
            groupData.put("inviteId", inviteId);
            groupData.put("groupName", createGroupRequest.getGroupName());
            groupData.put("ownerId", ownerUid);
            groupData.put("groupPicture", groupUrl);
            groupData.put("members", groupMembers);
            groupData.put("completedChallenges", new ArrayList<String>());
            groupData.put("currentChallengeId", null);
            groupData.put("votes", new HashMap<String, Object>());
            groupData.put("memberScores", Map.of(ownerUid, 0));

            db.collection("groups").document(groupId).set(groupData).get();

            DocumentReference userRef = db.collection("users").document(ownerUid);
            userRef.update("groups", FieldValue.arrayUnion(groupId)).get();

            return new CreateGroupResponse(
                    groupId,
                    inviteId,
                    createGroupRequest.getGroupName(),
                    groupMembers,
                    groupUrl
            );

        } catch (Exception e) {
            LogController.logError("Group could not be created: " + e.getMessage());
            throw new RuntimeException("Failed to create group: ", e);
        }
    }

    public List<CreateGroupResponse> getGroupsOfUser(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        DocumentSnapshot userDoc = db.collection("users").document(uid).get().get();
        if (!userDoc.exists()) {
            throw new RuntimeException("User not found");
        }

        List<String> groupIds = (List<String>) userDoc.get("groups");
        if (groupIds == null || groupIds.isEmpty()) {
            return List.of();
        }

        List<CreateGroupResponse> groups = new ArrayList<>();
        for (String groupId : groupIds) {
            DocumentSnapshot groupDoc = db.collection("groups").document(groupId).get().get();
            if (groupDoc.exists()) {
                groups.add(groupDoc.toObject(CreateGroupResponse.class));
            }
        }
        return groups;
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

    public String uploadGroupPicture(String groupId, byte[] fileBytes) {
        Bucket bucket = StorageClient.getInstance().bucket();

        String fileName = "groups/" + groupId + "/group.jpg";
        bucket.create(fileName, fileBytes, "image/jpeg");

        return "https://firebasestorage.googleapis.com/v0/b/"
                + bucket.getName()
                + "/o/"
                + fileName.replace("/", "%2F")
                + "?alt=media";
    }

    public CreateGroupResponse joinGroup(String uid, String inviteId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        QuerySnapshot query = db.collection("groups")
                .whereEqualTo("inviteId", inviteId)
                .get().get();

        if (query.isEmpty()) {
            throw new RuntimeException("Group with inviteId not found");
        }

        DocumentSnapshot groupDoc = query.getDocuments().getFirst();
        String groupId = groupDoc.getId();

        DocumentSnapshot userDoc = db.collection("users").document(uid).get().get();
        if (!userDoc.exists()) {
            throw new RuntimeException("User not found in Firestore");
        }

        Map<String, Object> newMember = Map.of(
                "uid", Objects.requireNonNull(userDoc.getString("uid")),
                "username", Objects.requireNonNull(userDoc.getString("username")),
                "email", Objects.requireNonNull(userDoc.getString("email")),
                "profilePicture", Objects.requireNonNull(userDoc.getString("profilePicture"))
        );

        DocumentReference groupRef = db.collection("groups").document(groupId);

        groupRef.update("members", FieldValue.arrayUnion(newMember)).get();

        groupRef.update("memberScores." + uid, 0).get();

        DocumentReference userRef = db.collection("users").document(uid);
        userRef.update("groups", FieldValue.arrayUnion(groupId)).get();

        DocumentSnapshot updatedGroupDoc = groupRef.get().get();
        return updatedGroupDoc.toObject(CreateGroupResponse.class);
    }

    public void voteSinglePlace(String groupId, String challengeId, String voterUid, String place, String votedFor) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        DocumentReference groupRef = db.collection("groups").document(groupId);
        DocumentSnapshot groupDoc = groupRef.get().get();

        if (!groupDoc.exists()) {
            throw new RuntimeException("Group not found");
        }

        if (votedFor.equals(voterUid)) {
            throw new RuntimeException("You cannot vote for yourself!");
        }

        groupRef.update("votes." + challengeId + "." + voterUid + "." + place, votedFor).get();

        int points;
        switch (place) {
            case "first" -> points = 3;
            case "second" -> points = 2;
            case "third" -> points = 1;
            default -> throw new IllegalArgumentException("Invalid place: " + place);
        }

        groupRef.update("memberScores." + votedFor, FieldValue.increment(points)).get();
    }

    public List<ResultEntry> calculateResults(String groupId, String challengeId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        DocumentSnapshot groupDoc = db.collection("groups").document(groupId).get().get();
        if (!groupDoc.exists()) {
            throw new RuntimeException("Group not found");
        }

        Object rawVotes = groupDoc.get("votes." + challengeId);
        if (!(rawVotes instanceof Map)) {
            return List.of();
        }

        Map<String, Map<String, String>> votes = (Map<String, Map<String, String>>) rawVotes;

        if (votes.isEmpty()) {
            return List.of();
        }

        Map<String, Integer> scores = new HashMap<>();
        for (Map<String, String> vote : votes.values()) {
            if (vote.get("first") != null) scores.merge(vote.get("first"), 3, Integer::sum);
            if (vote.get("second") != null) scores.merge(vote.get("second"), 2, Integer::sum);
            if (vote.get("third") != null) scores.merge(vote.get("third"), 1, Integer::sum);
        }

        return scores.entrySet().stream()
                .map(e -> new ResultEntry(e.getKey(), e.getValue()))
                .sorted((a, b) -> Integer.compare(b.getPoints(), a.getPoints()))
                .toList();
    }
}
