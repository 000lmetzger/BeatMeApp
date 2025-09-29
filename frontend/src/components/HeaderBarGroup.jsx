import React from "react";
import { ArrowLeft } from "lucide-react";
import BackwardsButton from "./BackwardsButton.jsx";
import {useGroup} from "../context/GroupContext.jsx";

export default function HeaderBarGroup({ onBack }) {
    const { group } = useGroup();

    console.log(group)

    return (
        <header className="sticky top-0 h-20 z-50 p-5 bg-[#006] text-white flex flex-row justify-between items-center shadow-md">
            <BackwardsButton onBack={onBack}></BackwardsButton>

            <div className="flex flex-col items-center text-center">
                <span className="text-lg font-semibold ">{group.groupName}</span>
                <span className="text-sm ">ID: {group.inviteId.slice(1)}</span>
            </div>

            <div>
                <img
                    src={group.groupPicture}
                    className="w-10 h-10 rounded-full object-cover border"
                />
            </div>
        </header>
    );
}
