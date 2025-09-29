import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes/routes.jsx";
import { UserProvider } from "./context/UserContext";
import { GroupProvider } from "./context/GroupContext.jsx";

function ProtectedLayout({ children, initialUser }) {
    return <UserProvider initialUser={initialUser}>{children}</UserProvider>;
}

const devUser = {
    email: "felix@example.com",
    groups: [
        "0a427889-0127-4fe5-9e27-48d00ed12b20",
        "92dd5d09-760e-4f96-a00e-0718bbd22523"
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
                                <GroupProvider>
                                    <ProtectedLayout initialUser={devUser}>
                                        {route.element}
                                    </ProtectedLayout>
                                </GroupProvider>
                            }
                        />
                    ))}

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
