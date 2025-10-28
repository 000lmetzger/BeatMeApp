import { useUser } from "../context/UserContext.jsx";
import { useGroup } from "../context/GroupContext.jsx";
import { API_URL } from "../config/config.js";
import useSWR from "swr";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fetcher = async (url) => {
    const token = localStorage.getItem("firebaseToken");
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Could not fetch scores");
    return res.json();
};

function Ranking() {
    const { user } = useUser();
    const { group } = useGroup();

    const memberIdToUsername = (mid) => {
        const members = group.members;
        for (let member of members){
            if (member.uid === mid) return [member.username, member.profilePicture];
        }
        return ["No user", ""];
    }

    const { data: scores, error, isLoading } = useSWR(
        group?.groupId ? `${API_URL}/groups/${group.groupId}/scores` : null,
        fetcher
    );

    // Premium loading state
    if (isLoading) {
        return (
            <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
                <Card className="rounded-2xl shadow-2xl shadow-black/10 border-0 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-8 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full" />
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Ranking
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-24 rounded-lg" />
                                </div>
                                <Skeleton className="h-6 w-12 rounded-lg" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
                <Card className="rounded-2xl border-red-200 bg-red-50/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <p className="text-red-800 font-medium">Error loading scores: {error.message}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const sortedScores = scores ? Object.entries(scores).sort(([, pointsA], [, pointsB]) => pointsB - pointsA) : [];

    return (
        <div className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
            <Card className="rounded-2xl shadow-2xl shadow-black/10 border-0 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-orange-50/20 pointer-events-none" />

                <CardHeader className="relative pb-6">
                    <div className="flex items-center gap-3 mb-4">
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                        Ranking
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative space-y-3">
                    {sortedScores.length > 0 ? (
                        sortedScores.map(([memberId, points], index) => {
                            const isCurrentUser = memberId === user.uid;
                            const [username, profilePicture] = memberIdToUsername(memberId);

                            return (
                                <div
                                    key={memberId}
                                    className={`relative group transition-all duration-300 hover:scale-[1.02] ${
                                        isCurrentUser
                                            ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50'
                                            : 'bg-white/60 hover:bg-white/80'
                                    } rounded-xl p-4 shadow-sm hover:shadow-lg backdrop-blur-sm`}
                                >
                                    {/* Subtle glow effect for current user */}
                                    {isCurrentUser && (
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-sm -z-10" />
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="text-xs font-medium w-8 h-8 flex items-center justify-center rounded-full">
                                                    #{index + 1}
                                                </Badge>
                                                <Avatar className="w-12 h-12 ring-2 ring-white/50 shadow-md">
                                                    <AvatarImage src={profilePicture} alt="Profile" className="object-cover" />
                                                    <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-semibold">
                                                        {username?.charAt(0)?.toUpperCase() || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-semibold text-lg ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {username}
                                                </span>
                                                {isCurrentUser && (
                                                    <Badge variant="secondary" className="w-fit text-xs bg-blue-100 text-blue-700">
                                                        You
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className={`text-2xl font-bold ${isCurrentUser ? 'text-blue-900' : 'text-gray-800'}`}>
                                                {points}
                                            </div>
                                            <Badge variant="outline" className="text-xs text-gray-500">
                                                pts
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">🏆</div>
                            <p className="text-lg font-medium">No scores yet</p>
                            <p className="text-sm">Complete challenges to earn points!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Ranking;