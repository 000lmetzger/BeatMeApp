import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext.jsx";
import { useGroup } from "../context/GroupContext.jsx";
import { API_URL } from "../config/config.js";

function Ranking() {
    const { user } = useUser();
    const { group } = useGroup();
    const [scores, setScores] = useState({});

    const memberIdToUsername = (mid) => {
        const members = group.members;
        for (let member of members){
            if (member.uid === mid) return [member.username, member.profilePicture];
        }
        return ["No user", ""];
    }

    useEffect(() => {
        const fetchScores = async () => {
            if (!group?.groupId) return;

            try {
                const token = localStorage.getItem("firebaseToken");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                const response = await fetch(`${API_URL}/groups/${group.groupId}/scores`, { headers });

                if (!response.ok) {
                    console.error("Could not fetch scores");
                }

                const data = await response.json();
                setScores(data);
            } catch (err) {
                console.error("Error fetching scores:", err);
            }
        };

        fetchScores();
    }, [group]);

    return (
        <div className="bg-gray-100 flex flex-col pb-[20%] flex-1 justify-start items-center p-5">
            <h1 className="font-bold text-2xl mb-5">Ranking</h1>
            <div className="w-full max-w-md flex flex-col bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-row justify-between font-semibold border-b pb-2 mb-2 text-gray-700">
                    <div>Name</div>
                    <div>Points</div>
                </div>
                <div className="flex flex-col space-y-2">
                    {Object.entries(scores)
                        .sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
                        .map(([memberId, points]) => {
                            const bgcolor = (memberId === user.uid) ? "bg-blue-100" : "bg-white";
                            return (
                                <div
                                    key={memberId}
                                    className={`flex flex-row items-center justify-between p-3 rounded-md shadow-sm hover:shadow-md transition ${bgcolor}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={memberIdToUsername(memberId)[1]}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="font-medium">{memberIdToUsername(memberId)[0]}</span>
                                    </div>
                                    <div className="font-semibold text-gray-800">{points}</div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default Ranking;
