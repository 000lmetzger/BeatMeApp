import {timeUntilMidnight} from "../utils/utils.js";
import {useNavigate} from "react-router-dom";

function DisplaySingleGroupInUserHome( {group_information} ){
    const navigate = useNavigate();

    const navigateIntoGroup = (groupId) => {
        navigate(`/group/${groupId}`);
    }

    return(
        <div
            className="p-2 w-full h-40 border flex flex-col justify-between"
            onClick={() => navigateIntoGroup(group_information.groupId)}
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
                <b>{group_information.groupChallenge}</b>
                <br />
                {group_information.groupDescription}
            </div>
        </div>
    )
}

export default DisplaySingleGroupInUserHome;
