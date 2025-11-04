import React from "react";
import BackwardsButton from "./BackwardsButton.jsx";
import { useGroup } from "../context/GroupContext.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function HeaderBarGroup({ onBack }) {
    const { group } = useGroup();

    console.log(group.groupPicture)

    return (
        <header
            className="sticky top-0 z-50 h-20 px-4 sm:px-6 text-white flex items-center justify-between shadow-lg shadow-black/10"
            style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #ec4899 100%)"
            }}
        >
            <div className="flex items-center">
                <div className="ml-1 sm:ml-2 text-white">
                    <BackwardsButton onBack={onBack} />
                </div>
            </div>

            <div className="flex flex-col items-center text-center">
				<span className="text-lg font-semibold">
					{group?.groupName || ""}
				</span>
                <span className="text-sm text-white/80">
					ID: {group?.inviteId ? group.inviteId.slice(1) : ""}
				</span>
            </div>

            <div className="flex justify-end">
                <Avatar className="w-10 h-10">
                    <AvatarImage
                        src={group?.groupPicture}
                        alt="Group"
                        className="object-cover"
                    />
                    <AvatarFallback>GR</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}