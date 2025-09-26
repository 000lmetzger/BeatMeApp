package de.beatme.challenge;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import de.beatme.logging.LogController;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.UUID;

//@Component aktivieren, wenn alle Challenges geladen werden sollen
//@Component
public class ChallengeLoader implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ObjectMapper mapper = new ObjectMapper();

        InputStream inputStream = new ClassPathResource("challenges.json").getInputStream();
        List<Map<String, Object>> challenges =
                mapper.readValue(inputStream, new TypeReference<>() {});

        for (Map<String, Object> challenge : challenges) {
            String id = UUID.randomUUID().toString();
            challenge.put("challengeId", id);

            db.collection("challenges").document(id).set(challenge).get();
            LogController.logSuccess("Inserted challenge: " + challenge.get("challenge"));
        }
    }
}
