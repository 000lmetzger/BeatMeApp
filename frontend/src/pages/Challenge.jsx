import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext.jsx";
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";
import Submitted from "../components/Submitted.jsx";
import NotSubmitted from "../components/NotSubmitted.jsx";
import useSWR from "swr";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const fetcher = async (url) => {
    const token = localStorage.getItem("firebaseToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, { headers });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.error || `Fetch error (Status: ${res.status})`;
        throw new Error(message);
    }

    return res.json();
};

// Hilfsfunktion zur Bestimmung des Dateityps
const getFileType = (filename) => {
    if (!filename) return 'unknown';

    const extension = filename.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';

    return 'unknown';
};

export function Challenge() {
    const { user } = useUser();
    const { group } = useGroup();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [dummyNotice, setDummyNotice] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    useEffect(() => {
        setIsMobile(/android|iPad|iPhone|iPod/i.test(navigator.userAgent));
    }, []);

    const { data: challenge, error: challengeError, isLoading: challengeLoading } = useSWR(
        group?.groupId ? `${API_URL}/challenges/group/${group.groupId}/current` : null,
        fetcher
    );

    const { data: challengeDone, error: submissionError, isLoading: submissionLoading } = useSWR(
        group?.groupId ? `${API_URL}/challenges/group/${group.groupId}/current/submission` : null,
        fetcher
    );

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0] || null;
        if (selectedFile) {
            setFile(selectedFile);
            handleUpload(selectedFile);
        }
    };

    const handleUpload = async (fileToUpload) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const uid = user?.uid;
        if (!uid || !fileToUpload) {
            setError("Error: Please sign in and select a file.");
            setLoading(false);
            return;
        }

        const apiUrl = `${API_URL}/groups/${group.groupId}/challenges/${challenge.challengeId}/submit`;
        const formData = new FormData();
        formData.append("file", fileToUpload);

        try {
            const token = localStorage.getItem("firebaseToken");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const res = await fetch(`${apiUrl}?uid=${uid}`, {
                method: "POST",
                headers,
                body: formData,
            });

            if (!res.ok) {
                let errorMessage = `Upload failed (Status: ${res.status})`;
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {}
                setError(errorMessage);
                console.error(errorMessage);
                return;
            }

            setSuccessMessage("Successfully submitted!");
            setFile(null);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message || "An unexpected upload error occurred");
        } finally {
            setLoading(false);
        }
    };

    const buttonStyle = {
        padding: "14px 24px",
        border: "none",
        borderRadius: "16px",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: "600",
        fontSize: "16px",
        backgroundColor: loading ? "#9CA3AF" : "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        flex: 1,
        textAlign: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translateY(0)",
        position: "relative",
        overflow: "hidden",
    };

    const outlineButtonStyle = {
        ...buttonStyle,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        border: "2px solid hsl(var(--primary))",
        color: "hsl(var(--primary))",
        boxShadow: "0 8px 32px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.2)",
    };

    if (challengeLoading || submissionLoading) {
        return (
            <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
                <Card className="rounded-2xl shadow-2xl shadow-black/10 border-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl">
                    <CardHeader className="space-y-4">
                        <Skeleton className="h-8 w-3/4 rounded-xl" />
                        <Skeleton className="h-4 w-full rounded-lg" />
                        <Skeleton className="h-4 w-2/3 rounded-lg" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <Skeleton className="h-12 flex-1 rounded-2xl" />
                            <Skeleton className="h-12 flex-1 rounded-2xl" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (challengeError) {
        return (
            <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
                <Alert className="rounded-2xl border-red-200 bg-red-50/80 backdrop-blur-sm">
                    <AlertDescription className="text-red-800 font-medium">
                        Error loading challenge: {challengeError.message}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (submissionError) {
        return (
            <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
                <Alert className="rounded-2xl border-red-200 bg-red-50/80 backdrop-blur-sm">
                    <AlertDescription className="text-red-800 font-medium">
                        Error loading submission: {submissionError.message}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div
            className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto
                       max-h-[90vh] overflow-y-auto"
        >
            {dummyNotice && (
                <Alert className="mb-6 rounded-2xl border-amber-200 bg-gradient-to-r from-amber-50/90 to-orange-50/90 backdrop-blur-sm shadow-lg">
                    <AlertDescription className="text-amber-800 font-medium">
                        No challenge found, using dummy data.
                    </AlertDescription>
                </Alert>
            )}

            <Card
                className="rounded-2xl shadow-2xl shadow-black/10 border-0
                           bg-gradient-to-br from-white/95 to-white/80
                           backdrop-blur-xl overflow-hidden
                           overflow-y-auto max-h-[85vh]"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none" />

                <CardHeader className="relative pb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                        <Badge
                            variant="secondary"
                            className="rounded-full px-3 py-1 text-xs font-medium bg-blue-100/80 text-blue-700"
                        >
                            Challenge
                        </Badge>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        {challenge?.challenge || ""}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 leading-relaxed mt-3">
                        {challenge?.description || ""}
                    </CardDescription>
                </CardHeader>

                <CardContent className="relative pt-0">
                    {challengeDone?.submitted ? (
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-xl" />
                            <div className="relative">
                                <Submitted
                                    image={challengeDone}
                                    fileType={getFileType(challengeDone?.filename || challengeDone?.url)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl blur-xl" />
                            <div className="relative">
                                <NotSubmitted
                                    {...{
                                        error,
                                        successMessage,
                                        file,
                                        cameraInputRef,
                                        fileInputRef,
                                        handleFileChange,
                                        buttonStyle,
                                        openFileBrowser: () => fileInputRef.current?.click(),
                                        outlineButtonStyle,
                                        loading,
                                        isMobile,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Challenge;