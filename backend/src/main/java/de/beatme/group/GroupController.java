package de.beatme.group;

import de.beatme.logging.LogController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            LogController.logError("Group could not be created - ERROR MESSAGE: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
