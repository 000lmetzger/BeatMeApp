package de.beatme.user;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    @SneakyThrows
    public void createNewUser(CreateUserRequest request) {
        //User in Firebase Authentication anlegen
        UserRecord.CreateRequest authRequest = new UserRecord.CreateRequest()
                .setEmail(request.getEmail())
                .setPassword(request.getPassword());

        UserRecord userRecord = FirebaseAuth.getInstance().createUser(authRequest);
        String uid = userRecord.getUid();

        //Daten in Firestore speichern
        Firestore db = FirestoreClient.getFirestore();
        Map<String, Object> user = Map.of(
                "uid", uid,
                "username", request.getUsername(),
                "email", request.getEmail()
        );

        db.collection("users").document(uid).set(user).get();

    }
}
