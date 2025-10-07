package de.beatme.group;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import de.beatme.firebase.FirebaseConfig;
import de.beatme.logging.LogController;
import de.beatme.voting.ResultEntry;
import de.beatme.voting.VoteRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createGroup(@RequestPart("group") CreateGroupRequest groupRequest,
                                         @RequestPart(value = "groupPic", required = false) MultipartFile groupPic) {
        try {
            if (groupPic != null && !groupPic.isEmpty()) {
                String contentType = groupPic.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Please upload an image (jpg, png, ...)"));
                }
            }
            CreateGroupResponse response = groupService.createNewGroup(groupRequest, groupPic);
            LogController.logSuccess("Group successfully created");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LogController.logError("Group could not be created - ERROR MESSAGE: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getGroupsOfUser(Authentication authentication) {
        try {
            String uid = authentication.getName();
            return ResponseEntity.ok(groupService.getGroupsOfUser(uid));
        } catch (Exception e) {
            LogController.logError("Could not fetch groups of user - ERROR: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinGroup(@RequestParam String inviteId, Authentication authentication) {
        try {
            String uid = authentication.getName();
            CreateGroupResponse response = groupService.joinGroup(uid, inviteId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LogController.logError("Could not join group - ERROR: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{groupId}/challenges/{challengeId}/vote/first")
    public ResponseEntity<?> voteFirst(@PathVariable String groupId, @PathVariable String challengeId,
                                       @RequestParam String votedFor, Authentication authentication) {
        try {
            String uid = authentication.getName();
            groupService.voteSinglePlace(groupId, challengeId, uid, "first", votedFor);
            return ResponseEntity.ok(Map.of("message", "First place vote submitted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{groupId}/challenges/{challengeId}/vote/second")
    public ResponseEntity<?> voteSecond(@PathVariable String groupId, @PathVariable String challengeId,
                                        @RequestParam String votedFor, Authentication authentication) {
        try {
            String uid = authentication.getName();
            groupService.voteSinglePlace(groupId, challengeId, uid, "second", votedFor);
            return ResponseEntity.ok(Map.of("message", "Second place vote submitted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{groupId}/challenges/{challengeId}/vote/third")
    public ResponseEntity<?> voteThird(@PathVariable String groupId, @PathVariable String challengeId,
                                       @RequestParam String votedFor, Authentication authentication) {
        try {
            String uid = authentication.getName();
            groupService.voteSinglePlace(groupId, challengeId, uid, "third", votedFor);
            return ResponseEntity.ok(Map.of("message", "Third place vote submitted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{groupId}/scores")
    public ResponseEntity<?> getScores(@PathVariable String groupId) {
        try {
            DocumentSnapshot groupDoc = FirebaseConfig.db.collection("groups").document(groupId).get().get();
            if (!groupDoc.exists()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Group not found"));
            }
            Map<String, Long> scores = (Map<String, Long>) groupDoc.get("memberScores");
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{groupId}/challenges/{challengeId}/submit")
    public ResponseEntity<?> submitChallenge(@PathVariable String groupId, @PathVariable String challengeId,
                                             @RequestPart("file") MultipartFile file, Authentication authentication) {
        try {
            String uid = authentication.getName();
            String submissionUrl = groupService.submitChallenge(groupId, challengeId, uid, file);
            return ResponseEntity.ok(Map.of("message", "Submission uploaded", "url", submissionUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{groupId}/challenges/previous/submissions")
    public ResponseEntity<?> getPreviousSubmissions(@PathVariable String groupId, Authentication authentication) {
        try {
            String uid = authentication.getName();
            return ResponseEntity.ok(groupService.getSubmissionsOfPreviousChallenge(groupId, uid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
