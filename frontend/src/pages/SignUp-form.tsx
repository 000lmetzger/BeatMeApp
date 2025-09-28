import { useState } from "react"
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
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const apiUrl = "http://localhost:8080/users";


        const userRequest = {
            username: username,
            email: email,
            password: password,
        };

        const formData = new FormData();
        formData.append("user", JSON.stringify(userRequest));

        formData.append("profilePic", new Blob([""], { type: 'application/octet-stream' }), 'placeholder.txt');
        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                        let errorMessage = `Registrierung fehlgeschlagen (Status: ${res.status})`;
                        try {
                            // Versuche, den Fehlerbody als JSON zu parsen
                            const contentType = res.headers.get("content-type");
                            if (contentType && contentType.includes("application/json")) {
                                const errorData = await res.json();
                                errorMessage = errorData.error || errorMessage;
                            }
                        } catch (e) {
                            // Parsing fehlgeschlagen (Body war leer), ist ok.
                        }
                        throw new Error(errorMessage);
                    }

                    // ✅ Nur bei Erfolg JSON parsen
                    const responseData = await res.json();

                    console.log("Registrierung erfolgreich:", responseData);


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