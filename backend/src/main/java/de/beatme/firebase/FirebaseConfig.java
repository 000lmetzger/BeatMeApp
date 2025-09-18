package de.beatme.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.java.Log;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
@Log
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        try {
            ClassPathResource serviceAccount = new ClassPathResource("firebase-key.json");

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                    .setStorageBucket("beatme-1609.firebasestorage.app")
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            System.out.println();
            log.info("\u001B[32m× × × × × × × × × × × × × × × × × × \u001B[0m");
            log.info("\u001B[32m\u001B[1mSuccessfully conncted with firebase\u001B[0m");
            log.info("\u001B[32m× × × × × × × × × × × × × × × × × × \u001B[0m");
            System.out.println();


        } catch (Exception e) {
            System.out.println();
            log.info("\u001B[31m× × × × × × × × × × × × × × × × × × \u001B[0m");
            log.info("\u001B[1;31mERROR: Could not connect with Firebase: \u001B[0m" + e.getMessage() );
            log.info("\u001B[31m× × × × × × × × × × × × × × × × × × \u001B[0m");
            System.out.println();
        }
    }
}
