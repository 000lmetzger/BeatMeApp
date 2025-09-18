package de.beatme.user;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.StorageClient;
import de.beatme.logging.LogController;
import lombok.SneakyThrows;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@Log
public class UserService {

    @SneakyThrows
    public CreateUserResponse createNewUser(CreateUserRequest request, MultipartFile profilePic) {
        String uid = null;
        try {
            UserRecord.CreateRequest authRequest = new UserRecord.CreateRequest()
                    .setEmail(request.getEmail())
                    .setPassword(request.getPassword());
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(authRequest);
            uid = userRecord.getUid();

            String profileUrl = null;
            if (profilePic != null && !profilePic.isEmpty()) {
                String contentType = profilePic.getContentType();
                if (contentType != null && contentType.startsWith("image/")) {
                    profileUrl = uploadProfilePicture(uid, profilePic.getBytes());
                } else {
                    throw new IllegalArgumentException("Only images are supported (jpg, png, ...)");
                }
            }

            Firestore db = FirestoreClient.getFirestore();
            assert profileUrl != null;
            Map<String, Object> user = Map.of(
                    "uid", uid,
                    "username", request.getUsername(),
                    "email", request.getEmail(),
                    "profilePicture", profileUrl
            );

            db.collection("users").document(uid).set(user).get();

            LogController.logSuccess("User successfully created - uid: " + uid + ", username: " + request.getUsername() + ", email: " + request.getEmail() + ", profilePicture: " + profileUrl);
            return new CreateUserResponse(uid, request.getUsername(), request.getEmail(), profileUrl);

        } catch (Exception e) {
            // Rollback, falls Auth schon erfolgreich war
            if (uid != null) {
                try {
                    FirebaseAuth.getInstance().deleteUser(uid);
                } catch (Exception rollbackEx) {
                    LogController.logError("Rollback failed: " + rollbackEx.getMessage());
                }
            }
            throw e;
        }
    }

    public String uploadProfilePicture(String uid, byte[] fileBytes) throws Exception {
        Bucket bucket = StorageClient.getInstance().bucket();

        String fileName = "users/" + uid + "/profile.jpg";

        bucket.create(fileName, fileBytes, "image/jpeg");

        return "https://firebasestorage.googleapis.com/v0/b/"
                + bucket.getName()
                + "/o/"
                + fileName.replace("/", "%2F")
                + "?alt=media";
    }
}
