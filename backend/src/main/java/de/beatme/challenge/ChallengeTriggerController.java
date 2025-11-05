package de.beatme.challenge;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/challenges")
public class ChallengeTriggerController {

    private final ChallengeScheduler challengeScheduler;

    @Value("${API_KEY_TRIGGER_NEW_DAY}")
    private String expectedApiKey;

    public ChallengeTriggerController(ChallengeScheduler challengeScheduler) {
        this.challengeScheduler = challengeScheduler;
    }

    @PostMapping("/new_day")
    public ResponseEntity<String> triggerAssignDailyChallenges(
            @RequestHeader(value = "X-API-KEY", required = false) String apiKey
    ) {
        try {
            if (expectedApiKey == null || !expectedApiKey.equals(apiKey)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Unauthorized: Invalid or missing API key");
            }

            challengeScheduler.assignDailyChallenges();

            return ResponseEntity.ok(
                    "✅ New day triggered successfully: daily challenges have been assigned to all groups!"
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error assigning challenges: " + e.getMessage());
        }
    }
}
