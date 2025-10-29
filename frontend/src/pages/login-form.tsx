import { useState, useEffect } from "react";
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
import { useUser } from "@/context/UserContext";
import * as React from "react";

export function LoginForm({ className, ...props }) {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    // Animation beim Mounten
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSignUpClick = () => {
        navigate("/signup");
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const token = await firebaseUser.getIdToken();
            localStorage.setItem("firebaseToken", token);

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

            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                username,
                profilePicture,
                groups
            });

            console.log("Login successful:", firebaseUser.email);
            navigate("/home");
        } catch (err) {
            const firebaseErrorMessage = err.code
                ? `Login failed: ${err.code.split("/")[1]}`
                : "An unexpected error occurred.";
            console.error("Firebase Login Error:", err);
            setError(firebaseErrorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn(
            "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30 transition-all duration-300",
            className
        )} {...props}>
            <div className={cn(
                "w-full max-w-md transition-all duration-500 ease-out",
                isMounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}>
                {/* Header mit Animation */}
                <div className={cn(
                    "text-center mb-8 transition-transform duration-700",
                    isMounted ? "scale-100" : "scale-90"
                )}>
                    <h1 className={cn(
                        "text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2 transition-all duration-500",
                        "hover:scale-105 cursor-default"
                    )}>
                        Beat Me
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Welcome back! Ready to continue your journey.
                    </p>
                </div>

                {/* Card mit hover effects */}
                <Card className={cn(
                    "shadow-lg border-0 bg-card/95 backdrop-blur-sm transition-all duration-300",
                    "hover:shadow-xl hover:shadow-primary/5",
                    "dark:bg-card/90"
                )}>
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl text-center transition-all duration-300 hover:text-primary/90">
                            Login to your account
                        </CardTitle>
                        <CardDescription className="text-center transition-colors duration-300">
                            Enter your email below to access your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium transition-colors duration-200 hover:text-primary"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className={cn(
                                            "transition-all duration-200",
                                            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                            "hover:border-primary/30"
                                        )}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium transition-colors duration-200 hover:text-primary"
                                        >
                                            Password
                                        </Label>

                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className={cn(
                                            "transition-all duration-200",
                                            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                            "hover:border-primary/30"
                                        )}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className={cn(
                                        "p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm",
                                        "animate-in fade-in duration-200"
                                    )}>
                                        {error}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        type="submit"
                                        className={cn(
                                            "w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                                            "text-white bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a855f7]",
                                            "hover:from-[#6d28d9] hover:via-[#8b5cf6] hover:to-[#c084fc]",
                                            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7c3aed]",
                                            loading && "opacity-50 cursor-not-allowed"
                                        )}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                                Signing in...
                                            </div>
                                        ) : (
                                            "Login"
                                        )}
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-muted-foreground/20" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-card px-2 text-muted-foreground">
                                                Or continue with
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full transition-all duration-300",
                                            "hover:scale-[1.02] active:scale-[0.98]",
                                            "hover:border-primary hover:text-primary",
                                            "border-2"
                                        )}
                                        type="button"
                                        onClick={handleSignUpClick}
                                        disabled={loading}
                                    >
                                        Create an Account
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}