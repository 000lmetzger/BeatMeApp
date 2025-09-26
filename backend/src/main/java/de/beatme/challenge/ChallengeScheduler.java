package de.beatme.challenge;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@EnableScheduling
public class ChallengeScheduler {

    @Scheduled(cron = "0 0 0 * * *") // jeden Tag um 00:00 Uhr
    public void assignDailyChallenges() throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        List<QueryDocumentSnapshot> allChallenges = db.collection("challenges").get().get().getDocuments();
        List<QueryDocumentSnapshot> groups = db.collection("groups").get().get().getDocuments();

        for (DocumentSnapshot groupDoc : groups) {
            List<String> completed = Optional.ofNullable(groupDoc.get("completedChallenges", List.class))
                    .map(list -> (List<String>) list)
                    .orElseGet(ArrayList::new);


            String newChallengeId = allChallenges.stream()
                    .map(doc -> doc.getString("challengeId"))
                    .filter(id -> !completed.contains(id))
                    .findFirst()
                    .orElse(null);


            if (newChallengeId != null) {
                db.collection("groups").document(groupDoc.getId())
                        .update(Map.of(
                                "currentChallengeId", newChallengeId,
                                "challengeAssignedAt", LocalDate.now().toString(),
                                "completedChallenges", FieldValue.arrayUnion(newChallengeId)
                        ));
            }
        }
    }
}

