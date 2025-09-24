import { UserProvider } from "../context/UserContext.jsx";
import Home from "./Home.jsx";

const devUser = {
    email: "felix@example.com",
    groups: [
        "e883b952-07f8-4759-ba7d-2e547f63bfe9",
        "248618b0-79a5-4a2b-bbc6-bfe68121160d"
    ],
    profilePicture: "https://firebasestorage.googleapis.com/v0/b/beatme-1609.firebasestorage.app/o/users%2Fr0DqtbtzSLSJND0pyE2m5NpqtOy1%2Fprofile.jpg?alt=media",
    uid: "r0DqtbtzSLSJND0pyE2m5NpqtOy1",
    username: "Felix"
};

export default function HomeWrapper() {
    return (
        <UserProvider initialUser={devUser}>
            <Home />
        </UserProvider>
    );
}
