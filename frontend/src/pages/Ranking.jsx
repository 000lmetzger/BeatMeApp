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
            if (member.uid === mid) return member.username;
        }
        return "No user";
    }

    useEffect(() => {
        const fetchScores = async () => {
            if (!group?.groupId) return;

            try {
                const response = await fetch(`${API_URL}/groups/${group.groupId}/scores`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    console.error("Could not fetch scores");
                }

                const data = await response.json();
                setScores(data);
            } catch (err) {
                console.error("Error fetching scores:");
            }
        };

        fetchScores();
    }, [group]);

    return (
        <div className="bg-gray-100 flex pb-[20%] flex-1 flex-col justify-between items-center p-5">
            <h1 className="font-bold p-5">Ranking</h1>
            <div className="w-full h-full flex flex-col">
                <div className="flex flex-row justify-between font-semibold border-b pb-2">
                    <div>Name</div>
                    <div>Points</div>
                </div>
                <div className="flex flex-col justify-start mt-2">
                    {Object.entries(scores)
                        .sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
                        .map(([memberId, points]) => {
                            const bgcolor = (memberId === user.uid) ? "bg-blue-200" : "";
                            return (
                                <div
                                key={memberId}
                                className={`p-3 flex flex-row justify-between border-b py-1 ${bgcolor}`}
                                >
                                <div>{memberIdToUsername(memberId)}</div>
                                <div>{points}</div>
                            </div>);
                        })}
                </div>
            </div>
        </div>
    );
}

export default Ranking;
