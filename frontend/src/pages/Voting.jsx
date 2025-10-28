import VotingImagesOverview from "../components/VotingImagesOverview.jsx";
import useSWR from "swr";
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";

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

    // Submissions des gestrigen Challenges
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
            console.error("Kein Token gefunden, Vote nicht möglich.");
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
                console.error("Vote fehlgeschlagen:", errData.error || response.statusText);
                return;
            }

            const data = await response.json();
            console.log("Vote erfolgreich:", data);

            // SWR revalidate votesData nach erfolgreichem Vote
            if (votesUrl) {
                fetcher(votesUrl).then(updated => {
                    // SWR Mutation falls du mutate von SWR importierst
                    // mutate(votesUrl, updated, false);
                    console.log("VotesData aktualisiert:", updated);
                });
            }

            return data;
        } catch (err) {
            console.error("Fehler beim Voten:", err);
        }
    }

    if (!token) return <div>Bitte einloggen, um Voting zu sehen.</div>;
    if (error) return <div>Fehler beim Laden der Submissions: {error.message}</div>;
    if (isLoading) return <div>Lädt...</div>;

    return (
        <div className="bg-gray-100 flex flex-1 flex-col justify-between items-center">
            <h1 className="font-bold p-5">Voting</h1>
            {yesterdayChallenge && (
                <>
                    <b>{yesterdayChallenge.challenge}</b>
                    <div>{yesterdayChallenge.description}</div>
                </>
            )}
            <div className="w-full h-full flex flex-col">
                <VotingImagesOverview
                    imageData={imageData}
                    yesterdayChallenge={yesterdayChallenge}
                    vote={vote}
                    votesData={votesData ?? []} // immer ein Array
                />
                {votesError && <div style={{ color: "red" }}>Fehler beim Laden der Votes: {votesError.message}</div>}
            </div>
        </div>
    );
}

export default Voting;
