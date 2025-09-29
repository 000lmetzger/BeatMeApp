import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function SignUpForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [profilePicture, setProfilePicture] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!profilePicture) {
                    setError("A profile picture is required.");
                    setLoading(false);
                    return;
        }

        const apiUrl = "http://localhost:8080/users";

        const userRequest = {
            username,
            email,
            password,
        };

        try {

            const formData = new FormData();
            formData.append(
                "user",
                new Blob([JSON.stringify(userRequest)], { type: "application/json" })
            );
            formData.append("profilePic", profilePicture, profilePicture.name);

            const res = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                let errorMessage = `Registrierung fehlgeschlagen (Status: ${res.status})`;
                try {
                    const contentType = res.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await res.json();
                        errorMessage = errorData.error || errorMessage;
                    }
                } catch (e) {}
                throw new Error(errorMessage);
            }

            const responseData = await res.json();
            console.log("Registrierung erfolgreich:", responseData);
            navigate('/login')
        } catch (err: any) {
            console.error("Registrierungsfehler:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <h1>Beat Me</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>
                        Enter your email, User name and password to create an account
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
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="username"

                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                            <div className="grid gap-3">
                                <Label htmlFor="profile-picture">Profile Picture</Label>
                                    <Input
                                        id="profile-picture"
                                        type="file"
                                        accept="image/*" // Akzeptiert nur Bilddateien
                                        required // ZWINGEND ERFORDERLICH
                                        onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                                        />

                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Loading..." : "Sign Up"}
                                </Button>

                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}