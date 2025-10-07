import VotingImagesOverview from "../components/VotingImagesOverview.jsx";
import { useEffect, useState } from "react";
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";

function Voting() {
    const { group } = useGroup();
    const [pointsGiven, setPointsGiven] = useState([]);
    const [voting, setVoting] = useState([]);
    const [previousVoting, setPreviousVoting] = useState([]);

    const token = localStorage.getItem("firebaseToken");
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    useEffect(() => {
        async function fetchPreviousSubmissions() {
            if (!group?.groupId) return;

            try {
                const response = await fetch(
                    `${API_URL}/groups/${group.groupId}/challenges/previous/submissions`,
                    { headers }
                );

                if (!response.ok) {
                    console.error(`Fehler beim Laden der vorherigen Submissions: ${response.status}`);
                    return;
                }

                const data = await response.json();
                setPreviousVoting(data);
                console.log("Vorherige Challenge Submissions:", data);
            } catch (error) {
                console.error("Fehler beim Laden der vorherigen Submissions:", error);
            }
        }
        fetchPreviousSubmissions();
    }, [group?.groupId]);

    async function vote({ challengeId, userId, votedFor, position }) {
        try {
            const response = await fetch(
                `${API_URL}/groups/${group.groupId}/challenges/${challengeId}/vote/${position}?uid=${userId}&votedFor=${votedFor}`,
                { method: "POST", headers }
            );

            if (!response.ok) {
                console.error("Vote fehlgeschlagen!");
                return;
            }

            const data = await response.json();
            console.log("✅ Vote erfolgreich:", data);
            return data;
        } catch (err) {
            console.error("Fehler beim Voten:", err);
        }
    }

    return (
        <div className="bg-gray-100 flex flex-1 flex-col justify-between items-center">
            <h1 className="font-bold p-5">Voting</h1>
            <div className="w-full h-full flex flex-col">
                <VotingImagesOverview
                    voting={voting}
                    setVoting={setVoting}
                    pointsGiven={pointsGiven}
                    setPointsGiven={setPointsGiven}
                />
            </div>
        </div>
    );
}

export default Voting;
