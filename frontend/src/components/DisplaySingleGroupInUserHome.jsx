import { timeUntilMidnight } from "../utils/utils.js";
import { useNavigate } from "react-router-dom";
import { useGroup } from "../context/GroupContext.jsx";

function DisplaySingleGroupInUserHome({ group_information }) {
    const { setGroup } = useGroup();
    const navigate = useNavigate();

    const navigateIntoGroup = (groupId, challenge) => {
        setGroup(group_information);
        navigate(`/group/${groupId}`, { state: { challenge } });
    };

    const submissionCount =
        group_information?.submissionCount ?? group_information?.yesterdayData?.submissions?.length ?? 0;

    const votesGiven =
        typeof group_information?.votesGiven === "number"
            ? group_information.votesGiven
            : group_information?.votesData && typeof group_information.votesData === "object"
                ? Object.values(group_information.votesData).filter((v) => v != null).length
                : 0;

    const challengeDone = group_information?.challengeDone ?? false;

    let votingStatus;
    if (submissionCount === 0) {
        votingStatus = "no_voting";
    } else if (votesGiven >= submissionCount) {
        votingStatus = "done";
    } else {
        votingStatus = "vote_now";
    }

    return (
        <div
            className="p-2 w-full h-[180px] border flex flex-col justify-between"
            onClick={() => navigateIntoGroup(group_information.groupId, group_information?.yesterdayData?.challenge)}
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
                    {!challengeDone && <div className="bg-red-400 text-white p-1 rounded text-sm">{"Noch " + timeUntilMidnight()}</div>}
                    {challengeDone && <div className="bg-green-400 text-white p-1 rounded text-sm">✓</div>}
                    {votingStatus === "no_voting" && (
                        <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs transition">No Voting</div>
                    )}
                    {votingStatus === "vote_now" && (
                        <div className="bg-red-400 text-white px-2 py-1 rounded text-xs transition" onClick={(e) => e.stopPropagation()}>
                            Vote Now
                        </div>
                    )}
                    {votingStatus === "done" && (
                        <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs transition">Voting done</div>
                    )}
                </div>
            </div>

            <div className="text-[120%] mt-2">
                <b>{group_information?.yesterdayData?.challenge?.challenge || "No challenge found"}</b>
                <br />
                {group_information?.yesterdayData?.challenge?.description || ""}
            </div>
        </div>
    );
}

export default DisplaySingleGroupInUserHome;
