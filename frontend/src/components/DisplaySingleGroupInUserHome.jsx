import { timeUntilMidnight } from "../utils/utils.js";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import useSWR from "swr";
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";

function DisplaySingleGroupInUserHome({ group_information }) {
    const { setGroup } = useGroup();
    const [challengeDone, setChallengeDone] = useState(false);
    const [votingDone, setVotingDone ] = useState({first: null, second: null, third: null})
    const navigate = useNavigate();

    const navigateIntoGroup = (groupId, challenge) => {
        setGroup(group_information);
        navigate(`/group/${groupId}`, { state: { challenge } });
    };

    const fetcher = async (url) => {
        const token = localStorage.getItem("firebaseToken");
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            const text = await res.text();
            console.error("Fetch failed:", res.status, text);
            throw new Error("Failed to fetch");
        }
        return res.json();
    };

    const { data: cDone, error: cDoneError } = useSWR(
        group_information?.groupId
            ? `${API_URL}/challenges/group/${group_information.groupId}/current/submission`
            : null,
        fetcher
    );

    const { data: yesterdayData, error: yesterdayError } = useSWR(
        group_information?.groupId
            ? `${API_URL}/groups/${group_information.groupId}/challenges/previous/submissions`
            : null,
        fetcher
    );

    const yid = yesterdayData?.challenge?.challengeId;
    const { data: votesData, error: votesError } = useSWR(
        yid
            ? `${API_URL}/groups/${group_information.groupId}/challenges/${yid}/votes`
            : null,
        fetcher
    );

    useEffect(() => {
        setVotingDone(votesData || { first: null, second: null, third: null });
    }, [votesData]);


    useEffect(()=> {
        if (cDone) {
            setChallengeDone(cDone.submitted);
        }
    }, [cDone])


    return (
        <div
            className="p-2 w-full h-45 border flex flex-col justify-between"
            onClick={() => navigateIntoGroup(group_information.groupId, yesterdayData?.challenge)}
        >
            <div className="flex flex-row justify-between">
                <div className="flex items-center">
                    <img
                        src={group_information.groupPicture}
                        alt="Gruppenbild"
                        className="w-16 h-16 mr-2 rounded-md object-cover"
                    />
                    <div className="text-[160%]">{group_information.groupName}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {!challengeDone && (
                        <div className="bg-red-400 text-white p-1 rounded text-sm">
                            {"Noch " + timeUntilMidnight()}
                        </div>
                    )}
                    {challengeDone && (
                        <div className="bg-green-400 text-white p-1 rounded text-sm">✓</div>
                    )}
                    {(votingDone.first != null || votingDone.second != null || votingDone.third != null) ? (
                        <div
                            className="bg-red-400 text-white px-2 py-1 rounded text-xs transition"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            Vote Now
                        </div>
                    ) : (
                        <div
                            className="bg-blue-400 text-white px-2 py-1 rounded text-xs transition"
                        >
                            Voting done
                        </div>
                    )}
                </div>
            </div>

            <div className="text-[120%] mt-2">
                <b>{yesterdayData?.challenge?.challenge || "No challenge found"}</b>
                <br />
                {yesterdayData?.challenge?.description || ""}
            </div>
        </div>
    );
}

export default DisplaySingleGroupInUserHome;
