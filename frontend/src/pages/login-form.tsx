import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import * as React from "react"

export function LoginForm({ className, ...props }) {
    const navigate = useNavigate();
    const { setUser } = useUser(); // UserContext
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignUpClick = () => {
        navigate("/signup");
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Firebase Login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Firebase ID Token abrufen
            const token = await firebaseUser.getIdToken();
            localStorage.setItem("firebaseToken", token);

            // Firestore: User-Daten laden (username, profilePicture, groups)
            const db = getFirestore();
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);

            let username = null;
            let profilePicture = null;
            let groups = [];

            if (userSnap.exists()) {
                const data = userSnap.data();
                username = data.username || null;
                profilePicture = data.profilePicture || null;
                if (data.groups && Array.isArray(data.groups)) {
                    groups = data.groups;
                }
            }

            // User in Context setzen
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                username,
                profilePicture,
                groups
            });

            console.log("Login erfolgreich:", firebaseUser.email);

            // Weiterleiten
            navigate("/home");
        } catch (err) {
            const firebaseErrorMessage = err.code
                ? `Login failed: ${err.code.split("/")[1]}`
                : "An unexpected error occurred.";
            console.error("Firebase Login Fehler:", err);
            setError(firebaseErrorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <h1>Beat Me</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Loading..." : "Login"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full text-white"
                                    type="button"
                                    onClick={handleSignUpClick}
                                >
                                    Create an Account
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
