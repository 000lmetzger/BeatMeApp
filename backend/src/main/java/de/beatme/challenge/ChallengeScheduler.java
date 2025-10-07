package de.beatme.challenge;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.database.GenericTypeIndicator;
import de.beatme.firebase.FirebaseConfig;
import de.beatme.logging.LogController;
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

        List<QueryDocumentSnapshot> allChallenges = FirebaseConfig.db.collection("challenges").get().get().getDocuments();
        List<QueryDocumentSnapshot> groups = FirebaseConfig.db.collection("groups").get().get().getDocuments();

        for (DocumentSnapshot groupDoc : groups) {
            List<String> completed = (List<String>) groupDoc.get("completedChallenges");
            if (completed == null) {
                completed = new ArrayList<>();
            }

            final List<String> completedFinal = completed; // für Lambda nötig

            String newChallengeId = allChallenges.stream()
                    .map(doc -> doc.getString("challengeId"))
                    .filter(id -> !completedFinal.contains(id))
                    .findFirst()
                    .orElse(null);

            if (newChallengeId != null) {
                FirebaseConfig.db.collection("groups").document(groupDoc.getId())
                        .update(Map.of(
                                "currentChallengeId", newChallengeId,
                                "challengeAssignedAt", LocalDate.now().toString(),
                                "completedChallenges", FieldValue.arrayUnion(newChallengeId)
                        ));
                LogController.logSuccess(String.format("Assigned challenge %s", newChallengeId));
            }
        }
    }
}

