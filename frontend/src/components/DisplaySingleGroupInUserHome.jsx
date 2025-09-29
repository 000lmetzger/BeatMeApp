import {timeUntilMidnight} from "../utils/utils.js";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {API_URL} from "../config/config.js";
import {useGroup} from "../context/GroupContext.jsx";

function DisplaySingleGroupInUserHome( {group_information} ){
    const [challenge, setChallenge] = useState(null);
    const { setGroup } = useGroup();

    const navigate = useNavigate();

    const navigateIntoGroup = (groupId, challenge) => {
        setGroup(group_information);
        navigate(`/group/${groupId}`, { state: { challenge } });
    };

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const res = await fetch(API_URL + `/challenges/group/${group_information.groupId}/current`);
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
        };
        fetchChallenge();
    }, [group_information.groupId]);

    return(
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
                <div className="bg-black text-white p-1">{"Noch " + timeUntilMidnight()}</div>
            </div>
            <div className="text-[120%]">
                <b>{challenge ? challenge.challenge : "No challenge found"}</b>
                <br />
                {challenge ? challenge.description : ""}
            </div>
        </div>
    )
}

export default DisplaySingleGroupInUserHome;
