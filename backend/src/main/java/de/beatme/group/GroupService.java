package de.beatme.group;

import com.google.cloud.firestore.*;
import com.google.cloud.storage.Bucket;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.StorageClient;
import de.beatme.firebase.FirebaseConfig;
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
            String ownerUid = groupOwner.getUid();

            DocumentSnapshot userDoc = FirebaseConfig.db.collection("users").document(ownerUid).get().get();
            User ownerUser = userDoc.exists()
                    ? userDoc.toObject(User.class)
                    : new User(ownerUid,
                    Optional.ofNullable(groupOwner.getDisplayName()).orElse("Unknown"),
                    groupOwner.getEmail(),
                    groupOwner.getPhotoUrl() != null ? groupOwner.getPhotoUrl() : null);

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

            List<QueryDocumentSnapshot> allChallenges =
                    FirebaseConfig.db.collection("challenges").get().get().getDocuments();

            String assignedChallengeId = null;
            if (!allChallenges.isEmpty()) {
                Random random = new Random();
                assignedChallengeId = allChallenges
                        .get(random.nextInt(allChallenges.size()))
                        .getString("challengeId");
            }

            Map<String, Object> groupData = new HashMap<>();
            groupData.put("groupId", groupId);
            groupData.put("inviteId", inviteId);
            groupData.put("groupName", createGroupRequest.getGroupName());
            groupData.put("ownerId", ownerUid);
            groupData.put("groupPicture", groupUrl);
            groupData.put("members", groupMembers);
            groupData.put("completedChallenges", new ArrayList<String>());
            groupData.put("currentChallengeId", assignedChallengeId); // ✅ direkt setzen
            groupData.put("votes", new HashMap<String, Object>());
            groupData.put("memberScores", Map.of(ownerUid, 0));

            FirebaseConfig.db.collection("groups").document(groupId).set(groupData).get();

            DocumentReference userRef = FirebaseConfig.db.collection("users").document(ownerUid);
            userRef.update("groups", FieldValue.arrayUnion(groupId)).get();

            LogController.logSuccess("Assigned initial challenge " + assignedChallengeId + " to new group " + groupId);

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
        DocumentSnapshot userDoc = FirebaseConfig.db.collection("users").document(uid).get().get();
        if (!userDoc.exists()) {
            throw new RuntimeException("User not found");
        }

        List<String> groupIds = (List<String>) userDoc.get("groups");
        if (groupIds == null || groupIds.isEmpty()) {
            return List.of();
        }

        List<CreateGroupResponse> groups = new ArrayList<>();
        for (String groupId : groupIds) {
            DocumentSnapshot groupDoc = FirebaseConfig.db.collection("groups").document(groupId).get().get();
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
        QuerySnapshot query = FirebaseConfig.db.collection("groups")
                .whereEqualTo("inviteId", inviteId)
                .get().get();

        if (query.isEmpty()) {
            throw new RuntimeException("Group with inviteId not found");
        }

        DocumentSnapshot groupDoc = query.getDocuments().getFirst();
        String groupId = groupDoc.getId();

        DocumentSnapshot userDoc = FirebaseConfig.db.collection("users").document(uid).get().get();
        if (!userDoc.exists()) {
            throw new RuntimeException("User not found in Firestore");
        }

        Map<String, Object> newMember = Map.of(
                "uid", Objects.requireNonNull(userDoc.getString("uid")),
                "username", Objects.requireNonNull(userDoc.getString("username")),
                "email", Objects.requireNonNull(userDoc.getString("email")),
                "profilePicture", Objects.requireNonNull(userDoc.getString("profilePicture"))
        );

        DocumentReference groupRef = FirebaseConfig.db.collection("groups").document(groupId);

        groupRef.update("members", FieldValue.arrayUnion(newMember)).get();

        groupRef.update("memberScores." + uid, 0).get();

        DocumentReference userRef = FirebaseConfig.db.collection("users").document(uid);
        userRef.update("groups", FieldValue.arrayUnion(groupId)).get();

        DocumentSnapshot updatedGroupDoc = groupRef.get().get();
        return updatedGroupDoc.toObject(CreateGroupResponse.class);
    }

    public void voteSinglePlace(String groupId, String challengeId, String voterUid, String place, String votedFor) throws Exception {
        DocumentReference groupRef = FirebaseConfig.db.collection("groups").document(groupId);
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

    public String submitChallenge(String groupId, String challengeId, String uid, MultipartFile file) throws Exception {
        Bucket bucket = StorageClient.getInstance().bucket();

        String contentType = file.getContentType();
        if (contentType == null || !(contentType.startsWith("image/") || contentType.startsWith("video/"))) {
            throw new RuntimeException("Only images or videos are allowed");
        }

        String extension = Objects.requireNonNull(file.getOriginalFilename())
                .substring(file.getOriginalFilename().lastIndexOf(".") + 1);
        String fileName = "groups/" + groupId + "/challenges/" + challengeId + "/" + uid + "." + extension;

        bucket.create(fileName, file.getBytes(), contentType);

        String fileUrl = "https://firebasestorage.googleapis.com/v0/b/"
                + bucket.getName()
                + "/o/"
                + fileName.replace("/", "%2F")
                + "?alt=media";

        DocumentReference groupRef = FirebaseConfig.db.collection("groups").document(groupId);
        groupRef.update("submissions." + challengeId + "." + uid,
                        Map.of("url", fileUrl, "type", contentType, "timestamp", new Date()))
                .get();

        return fileUrl;
    }

    public Map<String, Object> getSubmissionsOfPreviousChallenge(String groupId, String uid) throws Exception {
        Firestore db = FirebaseConfig.db;
        DocumentSnapshot groupDoc = db.collection("groups").document(groupId).get().get();

        if (!groupDoc.exists()) {
            throw new RuntimeException("Group not found");
        }

        List<String> completedChallenges = (List<String>) groupDoc.get("completedChallenges");
        if (completedChallenges == null || completedChallenges.isEmpty()) {
            throw new RuntimeException("No previous challenge available");
        }

        String previousChallengeId;
        if (completedChallenges.size() >= 2) {
            previousChallengeId = completedChallenges.get(completedChallenges.size() - 2);
        } else {
            previousChallengeId = completedChallenges.get(0);
        }

        DocumentSnapshot challengeDoc = db.collection("challenges").document(previousChallengeId).get().get();
        if (!challengeDoc.exists()) {
            throw new RuntimeException("Challenge data not found for ID: " + previousChallengeId);
        }

        Map<String, Object> challengeData = challengeDoc.getData();

        Object raw = groupDoc.get("submissions." + previousChallengeId);
        List<Map<String, Object>> submissions = new ArrayList<>();

        if (raw instanceof Map<?, ?> submissionsMap) {
            for (Map.Entry<?, ?> entry : submissionsMap.entrySet()) {
                String userId = (String) entry.getKey();
                if (userId.equals(uid)) continue;

                Object submissionObj = entry.getValue();
                if (submissionObj instanceof Map<?, ?> submissionData) {
                    Map<String, Object> submission = new HashMap<>();
                    submission.put("uid", userId);
                    submission.put("url", submissionData.get("url"));
                    submission.put("type", submissionData.get("type"));
                    submission.put("timestamp", submissionData.get("timestamp"));

                    submission.put("challenge", challengeData);

                    submissions.add(submission);
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("challenge", challengeData);
        result.put("submissions", submissions);

        return result;
    }
}
