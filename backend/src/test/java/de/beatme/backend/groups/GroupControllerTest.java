package de.beatme.backend.groups;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.FirestoreClient;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class GroupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testCreateGroupWithImageAndGetGroupsOfUser() throws Exception {
        // 1. User in Firebase Auth anlegen
        String email = "groupuser" + System.currentTimeMillis() + "@example.com";
        UserRecord.CreateRequest createRequest = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword("test1234");
        UserRecord testUser = FirebaseAuth.getInstance().createUser(createRequest);
        String ownerUid = testUser.getUid();

        // 2. User auch in Firestore anlegen
        Firestore db = FirestoreClient.getFirestore();
        db.collection("users").document(ownerUid).set(Map.of(
                "uid", ownerUid,
                "email", email,
                "username", "TestUser",
                "groups", List.of()
        )).get();

        String groupId = null;

        try {
            // 3. JSON für Gruppe
            String json = """
                    {
                      "ownerID": "%s",
                      "groupName": "BeatMe",
                      "userList": [],
                      "challengeList": []
                    }
                    """.formatted(ownerUid);

            // 4. Mock Gruppenbild
            MockMultipartFile groupPic = new MockMultipartFile(
                    "groupPic",
                    "group.jpg",
                    "image/jpeg",
                    "fakeImageData".getBytes()
            );

            // 5. Gruppe erstellen
            MvcResult result = mockMvc.perform(multipart("/groups")
                            .file(new MockMultipartFile("group", "", "application/json", json.getBytes()))
                            .file(groupPic))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.groupId").exists())
                    .andExpect(jsonPath("$.groupName").value("BeatMe"))
                    .andReturn();

            // 6. groupId aus Response extrahieren
            String response = result.getResponse().getContentAsString();
            groupId = JsonPath.read(response, "$.groupId");

            // 7. Gruppen des Users abfragen
            mockMvc.perform(get("/groups/user/{uid}", ownerUid))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType("application/json"))
                    .andExpect(jsonPath("$[0].groupId").value(groupId));

        } finally {
            // 8. Cleanup
            FirebaseAuth.getInstance().deleteUser(ownerUid);
            if (groupId != null) {
                db.collection("groups").document(groupId).delete().get();
            }
            db.collection("users").document(ownerUid).delete().get();
        }
    }
}
