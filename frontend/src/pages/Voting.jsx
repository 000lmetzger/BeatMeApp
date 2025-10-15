import VotingImagesOverview from "../components/VotingImagesOverview.jsx";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";

const fetcher = async (url) => {
    const token = localStorage.getItem("firebaseToken");
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Fehler beim Laden der Daten");
    const data = await response.json();
    return data;
};

function Voting() {
    const { group } = useGroup();

    const { data, error, isLoading } = useSWR(
        group?.groupId
            ? `${API_URL}/groups/${group.groupId}/challenges/previous/submissions`
            : null,
        fetcher
    );

    const imageData = data?.submissions?.map(sub => ({ ...sub, points: 0 })) ?? [];
    const yesterdayChallenge = data?.challenge ?? null;

    const { data: votesData, error: votesError } = useSWR(
        group?.groupId && yesterdayChallenge?.challengeId
            ? `${API_URL}/groups/${group.groupId}/challenges/${yesterdayChallenge.challengeId}/votes`
            : null,
        fetcher
    );

    async function vote(cid, userId, votedFor, position) {
        try {
            const token = localStorage.getItem("firebaseToken");
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };
            const response = await fetch(
                `${API_URL}/groups/${group.groupId}/challenges/${cid}/vote/${position}?uid=${userId}&votedFor=${votedFor.uid}`,
                { method: "POST", headers }
            );

            if (!response.ok) {
                console.error("Vote fehlgeschlagen!");
                return;
            }

            const data = await response.json();
            console.log("Vote erfolgreich:", data);
            return data;
        } catch (err) {
            console.error("Fehler beim Voten:", err);
        }
    }

    if (error) return <div>Fehler beim Laden der Submissions.</div>;
    if (isLoading) return <div>Lädt...</div>;

    return (
        <div className="bg-gray-100 flex flex-1 flex-col justify-between items-center">
            <h1 className="font-bold p-5">Voting</h1>
            <b>{yesterdayChallenge.challenge}</b>
            <div>{yesterdayChallenge.description}</div>
            <div className="w-full h-full flex flex-col">
                <VotingImagesOverview
                    imageData={imageData}
                    yesterdayChallenge={yesterdayChallenge}
                    vote={vote}
                    votesData={votesData}
                />
            </div>
        </div>
    );
}

export default Voting;
