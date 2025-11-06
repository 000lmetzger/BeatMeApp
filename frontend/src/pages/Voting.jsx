import VotingImagesOverview from "../components/VotingImagesOverview.jsx";
import useSWR from "swr";
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fetcher = async (url) => {
    const token = localStorage.getItem("firebaseToken");

    if (!token) {
        throw new Error("Kein Token gefunden. Bitte einloggen.");
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || `Fehler beim Laden der Daten (Status: ${response.status})`;
        throw new Error(message);
    }

    return response.json();
};

function Voting() {
    const { group } = useGroup();
    const token = localStorage.getItem("firebaseToken");

    // Submissions
    const submissionsUrl =
        group?.groupId && token
            ? `${API_URL}/groups/${group.groupId}/challenges/previous/submissions`
            : null;

    const { data, error, isLoading } = useSWR(submissionsUrl, fetcher);

    const imageData = data?.submissions?.map(sub => ({ ...sub, points: 0 })) ?? [];
    const yesterdayChallenge = data?.challenge ?? null;

    // Votes für das gestrige Challenge
    const votesUrl =
        group?.groupId && yesterdayChallenge?.challengeId && token
            ? `${API_URL}/groups/${group.groupId}/challenges/${yesterdayChallenge.challengeId}/votes`
            : null;

    const { data: votesData, error: votesError } = useSWR(votesUrl, fetcher);

    async function vote(cid, userId, votedFor, position) {
        if (!token) {
            console.error("No token found.");
            return;
        }

        try {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            };

            const response = await fetch(
                `${API_URL}/groups/${group.groupId}/challenges/${cid}/vote/${position}?uid=${userId}&votedFor=${votedFor.uid}`,
                { method: "POST", headers }
            );

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error("An error occurred during voting:", errData.error || response.statusText);
                return;
            }

            const data = await response.json();
            console.log("Vote successful:", data);

            // SWR revalidate votesData nach erfolgreichem Vote
            if (votesUrl) {
                fetcher(votesUrl).then(updated => {
                    console.log("VotesData updated:", updated);
                });
            }

            return data;
        } catch (err) {
            console.error("Error during voting:", err);
        }
    }

    // Premium loading state
    if (isLoading) {
        return (
            <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
                <Card className="rounded-2xl shadow-2xl shadow-black/10 border-0 bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/80 dark:to-gray-800/90 backdrop-blur-xl">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:bg-none dark:text-white">
                                Voting
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-3/4 rounded-lg" />
                            <Skeleton className="h-4 w-full rounded-lg" />
                            <Skeleton className="h-4 w-2/3 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-48 rounded-xl" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
                <Alert className="rounded-2xl border-amber-200 bg-amber-50/80 dark:bg-amber-900/30 backdrop-blur-sm">
                    <AlertDescription className="text-amber-800 dark:text-amber-100 font-medium">
                        Bitte einloggen, um Voting zu sehen.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
                <Alert className="rounded-2xl border-red-200 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm">
                    <AlertDescription className="text-red-800 dark:text-red-100 font-medium">
                        Fehler beim Laden der Submissions: {error.message}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
            <Card className="rounded-2xl shadow-2xl shadow-black/10 border-0 bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/80 dark:to-gray-800/90 backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-pink-50/20 dark:from-purple-900/10 dark:to-pink-900/10 pointer-events-none" />

                <CardHeader className="relative pb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
                        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium bg-purple-100/80 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
                            Vote Now
                        </Badge>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        Voting
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative space-y-6">
                    {yesterdayChallenge && (
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl blur-xl" />
                            <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {yesterdayChallenge.challenge}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {yesterdayChallenge.description}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl blur-xl" />
                        <div className="relative">
                            <VotingImagesOverview
                                imageData={imageData}
                                yesterdayChallenge={yesterdayChallenge}
                                vote={vote}
                                votesData={votesData ?? []}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Voting;
