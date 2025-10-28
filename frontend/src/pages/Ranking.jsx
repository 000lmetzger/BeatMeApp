import { useUser } from "../context/UserContext.jsx";
import { useGroup } from "../context/GroupContext.jsx";
import { API_URL } from "../config/config.js";
import useSWR from "swr";

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

    return (
        <div className="bg-gray-100 flex flex-col pb-[20%] flex-1 justify-start items-center p-5">
            <h1 className="font-bold text-2xl mb-5">Ranking</h1>
            <div className="w-full max-w-md flex flex-col bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-row justify-between font-semibold border-b pb-2 mb-2 text-gray-700">
                    <div>Name</div>
                    <div>Points</div>
                </div>
                <div className="flex flex-col space-y-2">
                    {scores
                        ? Object.entries(scores)
                            .sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
                            .map(([memberId, points]) => {
                                const bgcolor = memberId === user.uid ? "bg-blue-100" : "bg-white";
                                const [username, profilePicture] = memberIdToUsername(memberId);

                                return (
                                    <div
                                        key={memberId}
                                        className={`flex flex-row items-center justify-between p-3 rounded-md shadow-sm hover:shadow-md transition ${bgcolor}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={profilePicture}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <span className="font-medium">{username}</span>
                                        </div>
                                        <div className="font-semibold text-gray-800">{points}</div>
                                    </div>
                                );
                            })
                        : <div>Loading scores...</div>}
                </div>
            </div>
        </div>
    );
}

export default Ranking;
