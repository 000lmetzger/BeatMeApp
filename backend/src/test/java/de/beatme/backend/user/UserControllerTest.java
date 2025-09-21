package de.beatme.backend.user;

import com.google.firebase.auth.FirebaseAuth;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testCreateUserAndDeleteAfterwards() throws Exception {
        // 1. Eindeutige Email
        String randomEmail = "felix" + System.currentTimeMillis() + "@example.com";

        // 2. User JSON
        String json = """
            {
              "username": "Felix",
              "email": "%s",
              "password": "lol123",
              "profilePicture": null
            }
            """.formatted(randomEmail);

        // 3. Mock Profilbild
        byte[] imageBytes = "fakeImageData".getBytes();
        MockMultipartFile image = new MockMultipartFile(
                "profilePic", "profile.jpg", "image/jpeg", imageBytes);

        // 4. Request ausführen und UID extrahieren
        MvcResult result = mockMvc.perform(multipart("/users")
                        .file(new MockMultipartFile("user", "", "application/json", json.getBytes()))
                        .file(image))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uid").exists())
                .andReturn();

        // 5. UID aus Response ziehen
        String response = result.getResponse().getContentAsString();
        String uid = JsonPath.read(response, "$.uid");

        // 6. Cleanup → User aus Firebase löschen
        FirebaseAuth.getInstance().deleteUser(uid);
    }

}
