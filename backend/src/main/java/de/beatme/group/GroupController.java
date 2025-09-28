package de.beatme.group;

import de.beatme.logging.LogController;
import de.beatme.voting.ResultEntry;
import de.beatme.voting.VoteRequest;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/user/{uid}")
    public ResponseEntity<?> getGroupsOfUser(@PathVariable String uid) {
        try {
            return ResponseEntity.ok(groupService.getGroupsOfUser(uid));
        } catch (Exception e) {
            LogController.logError("Could not fetch groups of user - ERROR: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinGroup(@RequestParam String uid, @RequestParam String inviteId) {
        try {
            CreateGroupResponse response = groupService.joinGroup(uid, inviteId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LogController.logError("Could not join group - ERROR: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{groupId}/challenges/{challengeId}/vote")
    public ResponseEntity<?> vote(
            @PathVariable String groupId,
            @PathVariable String challengeId,
            @RequestParam String uid,
            @RequestBody VoteRequest voteRequest) {
        try {
            groupService.voteForChallenge(groupId, challengeId, uid, voteRequest);
            return ResponseEntity.ok(Map.of("message", "Vote submitted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{groupId}/challenges/{challengeId}/results")
    public ResponseEntity<?> getResults(
            @PathVariable String groupId,
            @PathVariable String challengeId) {
        try {
            return ResponseEntity.ok(groupService.calculateResults(groupId, challengeId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
