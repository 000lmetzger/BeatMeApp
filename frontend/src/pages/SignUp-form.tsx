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
import { API_URL } from "../config/config.js"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../config/firebase"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { useUser } from "@/context/UserContext"
import * as React from "react"

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const { setUser } = useUser()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [profilePicture, setProfilePicture] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!profilePicture) {
            setError("A profile picture is required.")
            setLoading(false)
            return
        }

        const apiUrl = API_URL + "/users"
        const userRequest = { username, email, password }

        try {
            const formData = new FormData()
            formData.append("user", new Blob([JSON.stringify(userRequest)], { type: "application/json" }))
            formData.append("profilePic", profilePicture, profilePicture.name)

            const res = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                let errorMessage = `Registrierung fehlgeschlagen (Status: ${res.status})`
                try {
                    const contentType = res.headers.get("content-type")
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await res.json()
                        errorMessage = errorData.error || errorMessage
                    }
                } catch (e) {}
                console.error(errorMessage)
            }

            const responseData = await res.json()
            console.log("Registrierung erfolgreich:", responseData)

            const loginResult = await signInWithEmailAndPassword(auth, email, password)
            const firebaseUser = loginResult.user
            const token = await firebaseUser.getIdToken()
            localStorage.setItem("firebaseToken", token)

            const db = getFirestore()
            const userDocRef = doc(db, "users", firebaseUser.uid)
            const userSnap = await getDoc(userDocRef)

            let usernameFromDB = null
            let profilePictureFromDB = null
            let groups = []

            if (userSnap.exists()) {
                const data = userSnap.data()
                usernameFromDB = data.username || null
                profilePictureFromDB = data.profilePicture || null
                if (data.groups && Array.isArray(data.groups)) {
                    groups = data.groups
                }
            }

            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                username: usernameFromDB,
                profilePicture: profilePictureFromDB,
                groups,
            })

            navigate("/home")
        } catch (err: any) {
            console.error("Registrierungsfehler:", err)
            setError(err.message || "An unexpected error occurred.")
        } finally {
            setLoading(false)
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
                                    accept="image/*"
                                    required
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
