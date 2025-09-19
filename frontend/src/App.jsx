import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes/routes.jsx";
import { UserProvider } from "./context/UserContext";

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={routes.find(r => r.path === "/login").element} />
                    <Route path="/signup" element={routes.find(r => r.path === "/signup").element} />

                    {routes
                        .filter(r => r.path !== "/login" && r.path !== "/signup")
                        .map(route => (
                            <Route key={route.path} path={route.path} element={route.element} />
                        ))}

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
