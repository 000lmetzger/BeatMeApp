package de.beatme.challenge;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping("/group/{groupId}/current")
    public ResponseEntity<?> getCurrentChallenge(@PathVariable String groupId) {
        try {
            Challenge challenge = challengeService.getCurrentChallengeOfGroup(groupId);
            return ResponseEntity.ok(challenge);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/group/{groupId}/completed")
    public ResponseEntity<?> getCompletedChallenges(@PathVariable String groupId) {
        try {
            List<Challenge> challenges = challengeService.getCompletedChallengesOfGroup(groupId);
            return ResponseEntity.ok(challenges);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

