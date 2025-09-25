import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes/routes.jsx";
import { UserProvider } from "./context/UserContext";

function ProtectedLayout({ children, initialUser }) {
    return <UserProvider initialUser={initialUser}>{children}</UserProvider>;
}

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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={routes.find(r => r.path === "/login").element} />
                <Route path="/signup" element={routes.find(r => r.path === "/signup").element} />

                {routes
                    .filter(r => r.path !== "/login" && r.path !== "/signup")
                    .map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <ProtectedLayout initialUser={devUser}>
                                    {route.element}
                                </ProtectedLayout>
                            }
                        />
                    ))}

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
