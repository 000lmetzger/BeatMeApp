package de.beatme.challenge;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import de.beatme.firebase.FirebaseConfig;
import de.beatme.logging.LogController;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@EnableScheduling
public class ChallengeScheduler {

    @Scheduled(cron = "0 0 0 * * *") // jeden Tag um 00:00 Uhr
    public void assignDailyChallenges() throws Exception {

        Firestore db = FirebaseConfig.db;

        List<QueryDocumentSnapshot> allChallenges = db.collection("challenges").get().get().getDocuments();
        List<QueryDocumentSnapshot> groups = db.collection("groups").get().get().getDocuments();

        Random random = new Random();

        for (DocumentSnapshot groupDoc : groups) {

            List<String> completed = (List<String>) groupDoc.get("completedChallenges");
            if (completed == null) {
                completed = new ArrayList<>();
            }

            List<String> availableChallenges = new ArrayList<>();
            for (QueryDocumentSnapshot challengeDoc : allChallenges) {
                String challengeId = challengeDoc.getString("challengeId");
                if (challengeId != null && !completed.contains(challengeId)) {
                    availableChallenges.add(challengeId);
                }
            }

            if (availableChallenges.isEmpty()) {
                db.collection("groups").document(groupDoc.getId())
                        .update("completedChallenges", new ArrayList<>());
                availableChallenges = allChallenges.stream()
                        .map(doc -> doc.getString("challengeId"))
                        .filter(Objects::nonNull)
                        .toList();
            }

            String newChallengeId = availableChallenges.get(random.nextInt(availableChallenges.size()));

            db.collection("groups").document(groupDoc.getId())
                    .update(Map.of(
                            "currentChallengeId", newChallengeId,
                            "challengeAssignedAt", LocalDate.now().toString(),
                            "completedChallenges", FieldValue.arrayUnion(newChallengeId)
                    ));

            LogController.logSuccess(String.format(
                    "Assigned random challenge %s to group %s", newChallengeId, groupDoc.getId()
            ));
        }
    }
}