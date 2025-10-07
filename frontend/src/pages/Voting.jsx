import VotingImagesOverview from "../components/VotingImagesOverview.jsx";
import { useEffect, useState } from "react";
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";

function Voting() {
    const { group } = useGroup();
    const [pointsGiven, setPointsGiven] = useState([]);
    const [voting, setVoting] = useState([]);
    const [yesterdayChallengeId, setYesterdayChallengeId] = useState("");

    const token = localStorage.getItem("firebaseToken");
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    useEffect(() => {
        async function fetchCompletedChallenges() {
            if (!group?.groupId) return;

            try {
                const response = await fetch(
                    `${API_URL}/challenges/group/${group.groupId}/completed`,
                    { headers }
                );
                if (!response.ok) {
                    console.error(`Fehler beim Laden der Challenges: ${response.status}`);
                    return;
                }

                const data = await response.json();
                setYesterdayChallengeId(data[0]?.challengeId ?? "");
            } catch (error) {
                console.error("Fehler beim Laden der Challenges:", error);
            }
        }

        fetchCompletedChallenges();
    }, [group?.groupId]);

    useEffect(() => {
        async function fetchSubmissions() {
            if (!group?.groupId || !yesterdayChallengeId) return;

            try {
                const response = await fetch(
                    `${API_URL}/groups/${group.groupId}/challenges/${yesterdayChallengeId}/submissions`,
                    { headers }
                );

                if (!response.ok) {
                    console.error(`Fehler beim Laden der Submissions: ${response.status}`);
                    return;
                }

                const data = await response.json();
                console.log("dat: \n");
                console.log(data);
                setVoting(data);
            } catch (error) {
                console.error("Fehler beim Laden der Submissions:", error);
            }
        }

        fetchSubmissions();
    }, [group?.groupId, yesterdayChallengeId]);

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

    // 4️⃣ Render
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
