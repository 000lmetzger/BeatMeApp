package de.beatme.challenge;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ChallengeService {


    public Challenge getCurrentChallengeOfGroup(String groupId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        DocumentSnapshot groupDoc = db.collection("groups").document(groupId).get().get();
        if (!groupDoc.exists()) {
            throw new RuntimeException("Group not found");
        }

        String currentChallengeId = groupDoc.getString("currentChallengeId");
        if (currentChallengeId == null) {
            throw new RuntimeException("No challenge assigned yet");
        }

        DocumentSnapshot challengeDoc = db.collection("challenges").document(currentChallengeId).get().get();
        if (!challengeDoc.exists()) {
            throw new RuntimeException("Challenge not found");
        }

        return challengeDoc.toObject(Challenge.class);
    }

    public List<Challenge> getCompletedChallengesOfGroup(String groupId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        DocumentSnapshot groupDoc = db.collection("groups").document(groupId).get().get();
        if (!groupDoc.exists()) {
            throw new RuntimeException("Group not found");
        }

        List<String> challengeIds = (List<String>) groupDoc.get("completedChallenges");
        if (challengeIds == null || challengeIds.isEmpty()) {
            return List.of();
        }

        List<Challenge> challenges = new ArrayList<>();
        for (String id : challengeIds) {
            DocumentSnapshot challengeDoc = db.collection("challenges").document(id).get().get();
            if (challengeDoc.exists()) {
                challenges.add(challengeDoc.toObject(Challenge.class));
            }
        }
        return challenges;
    }

    public boolean hasUserSubmittedCurrentChallenge(String groupId, String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        DocumentSnapshot groupDoc = db.collection("groups").document(groupId).get().get();
        if (!groupDoc.exists()) {
            throw new RuntimeException("Group not found");
        }

        String currentChallengeId = groupDoc.getString("currentChallengeId");
        if (currentChallengeId == null) {
            throw new RuntimeException("No current challenge assigned");
        }

        Map<String, Object> submissions = (Map<String, Object>) groupDoc.get("submissions");
        if (submissions == null || submissions.isEmpty()) {
            return false;
        }

        Map<String, Object> challengeSubmissions = (Map<String, Object>) submissions.get(currentChallengeId);
        if (challengeSubmissions == null) {
            return false;
        }

        return challengeSubmissions.containsKey(uid);
    }
}

