import React from "react";
import BackwardsButton from "./BackwardsButton.jsx";
import { useGroup } from "../context/GroupContext.jsx";

export default function HeaderBarGroup({ onBack }) {
    const { group } = useGroup();

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
                <img
                    src={group?.groupPicture}
                    alt="Group"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/70 ring-2 ring-white/20"
                />
            </div>
        </header>
    );
}