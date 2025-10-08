import {timeUntilMidnight} from "../utils/utils.js";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {API_URL} from "../config/config.js";
import {useGroup} from "../context/GroupContext.jsx";

function DisplaySingleGroupInUserHome( {group_information} ){
    const [challenge, setChallenge] = useState(null);
    const { setGroup } = useGroup();
    const [challengeDone, setChallengeDone] = useState(false);
    const [votingDone, setVotingDone] = useState(false);

    const navigate = useNavigate();

    const navigateIntoGroup = (groupId, challenge) => {
        setGroup(group_information);
        navigate(`/group/${groupId}`, { state: { challenge } });
    };

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const token = localStorage.getItem("firebaseToken");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                const res = await fetch(API_URL + `/challenges/group/${group_information.groupId}/current`, {headers});
                if (res.ok) {
                    const data = await res.json();
                    setChallenge(data);
                } else {
                    setChallenge(null);
                }
            } catch (err) {
                console.error(err);
                setChallenge(null);
            }
            try {
                const token = localStorage.getItem("firebaseToken");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };

                const res = await fetch(`${API_URL}/challenges/group/${group_information.groupId}/current/submission`, { headers });
                if (!res.ok) {
                    console.error("Error loading challenge");
                }
                const data = await res.json();
                setChallengeDone(data.submitted);
            } catch (err) {
                console.error("Error loading challenge");
            }
        };
        fetchChallenge();
    }, [group_information.groupId]);

    return (
        <div
            className="p-2 w-full h-45 border flex flex-col justify-between"
            onClick={() => navigateIntoGroup(group_information.groupId, challenge)}
        >
            <div className="flex flex-row justify-between ">
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
                        <div className="bg-green-400 text-white p-1 rounded text-sm">
                            ✓
                        </div>
                    )}

                    {!votingDone && (
                        <div
                            className="bg-red-400 text-white px-2 py-1 rounded text-xs transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("Voting starten...");
                            }}
                        >
                            Vote Now
                        </div>
                    )}
                </div>
            </div>

            <div className="text-[120%] mt-2">
                <b>{challenge ? challenge.challenge : "No challenge found"}</b>
                <br />
                {challenge ? challenge.description : ""}
            </div>
        </div>
    );

}

export default DisplaySingleGroupInUserHome;
