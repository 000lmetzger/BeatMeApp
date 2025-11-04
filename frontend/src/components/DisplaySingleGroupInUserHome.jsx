import { timeUntilMidnight } from "../utils/utils.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { API_URL } from "../config/config.js";
import { useGroup } from "../context/GroupContext.jsx";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

function DisplaySingleGroupInUserHome({ group_information }) {
    const { setGroup } = useGroup();
    const [challengeDone, setChallengeDone] = useState(false);
    const [votingDone, setVotingDone] = useState({ first: null, second: null, third: null });
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

    const { data: cDone } = useSWR(
        group_information?.groupId
            ? `${API_URL}/challenges/group/${group_information.groupId}/current/submission`
            : null,
        fetcher
    );

    const { data: yesterdayData } = useSWR(
        group_information?.groupId
            ? `${API_URL}/groups/${group_information.groupId}/challenges/previous/submissions`
            : null,
        fetcher
    );

    const { data: challenge } = useSWR(
        group_information?.groupId ? `${API_URL}/challenges/group/${group_information.groupId}/current` : null,
        fetcher
    );


    const yid = yesterdayData?.challenge?.challengeId;
    const { data: votesData } = useSWR(
        yid ? `${API_URL}/groups/${group_information.groupId}/challenges/${yid}/votes` : null,
        fetcher
    );

    useEffect(() => {
        setVotingDone(votesData || { first: null, second: null, third: null });
    }, [votesData]);

    useEffect(() => {
        if (cDone) {
            setChallengeDone(cDone.submitted);
        }
    }, [cDone]);

    const submissionCount = yesterdayData?.submissions?.length || 0;
    const votesGiven = [votingDone.first, votingDone.second, votingDone.third].filter((v) => v != null).length;

    let votingStatus;
    if (submissionCount === 0) {
        votingStatus = "no_voting";
    } else if (votesGiven >= submissionCount) {
        votingStatus = "done";
    } else {
        votingStatus = "vote_now";
    }

    return (
        <Card
            className="w-full cursor-pointer rounded-xl border border-muted/60 bg-card/80 backdrop-blur-sm transition-all shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:border-muted hover:-translate-y-0.5"
            onClick={() => navigateIntoGroup(group_information.groupId, yesterdayData?.challenge)}
        >
            <CardContent className="p-4">
                <div className="flex flex-row justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-16 w-16 rounded-md">
                            <AvatarImage src={group_information.groupPicture} alt="Gruppenbild" className="object-cover" />
                            <AvatarFallback className="rounded-md">GR</AvatarFallback>
                        </Avatar>
                        <div className="text-xl font-semibold truncate">{group_information.groupName}</div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        {!challengeDone && (
                            <Badge variant="destructive" className="text-[10px] px-2 py-1">
                                {"Noch " + timeUntilMidnight()}
                            </Badge>
                        )}
                        {challengeDone && (
                            <Badge className="text-[10px] px-2 py-1 bg-green-500 hover:bg-green-500 text-white">✓</Badge>
                        )}

                        {votingStatus === "no_voting" && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-1">No Voting</Badge>
                        )}

                        {votingStatus === "vote_now" && (
                            <Badge
                                className="text-[10px] px-2 py-1 h-auto leading-none bg-slate-300 hover:bg-slate-400 text-slate-800 cursor-pointer transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Vote Now
                            </Badge>
                        )}

                        {votingStatus === "done" && (
                            <Badge variant="outline" className="text-[10px] px-2 py-1 text-muted-foreground">
                                Voting done
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="text-base mt-3">
                    <b>{challenge?.challenge ||  "No challenge found"}</b>
                    <br />
                    {challenge?.description || "No description found"}
                </div>
            </CardContent>
        </Card>
    );
}

export default DisplaySingleGroupInUserHome;