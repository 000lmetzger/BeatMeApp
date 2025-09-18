import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { LoginForm } from "./pages/login-form";

function App() {
    const [loggedIn, setLoggedIn] = useState(true);

    return (
        <Router>
            <Routes>
                <Route
                    path="/home"
                    element={loggedIn ? <Home /> : <Navigate to="/login" replace />}
                />
                <Route
                    path="/login"
                    element={!loggedIn ? <LoginForm /> : <Navigate to="/home" replace />}
                />
                <Route
                    path="*"
                    element={<Navigate to={loggedIn ? "/home" : "/login"} replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;
