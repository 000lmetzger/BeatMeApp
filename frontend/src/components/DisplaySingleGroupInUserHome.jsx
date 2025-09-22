import {timeUntilMidnight} from "../utils/utils.js";

function DisplaySingleGroupInUserHome( {group_information} ){
    return(
        <div className="p-2 w-full h-40 border flex flex-col justify-between">
            <div className="flex flex-row justify-between ">
                <div className="text-[160%]">{group_information.name}</div>
                <div className="bg-black text-white p-1">{"Noch " + timeUntilMidnight()}</div>
            </div>
            <div className="text-[120%]">
                <b>{group_information.challenge}</b>
                <br />
                {group_information.description}
            </div>
        </div>
    )
}

export default DisplaySingleGroupInUserHome;