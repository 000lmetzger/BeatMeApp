import React from "react";
import { ArrowLeft } from "lucide-react";

export default function HeaderBarGroup({ groupName, groupId, groupImage, onBack }) {
    return (
        <header className="sticky top-0 h-20 z-50 p-5 bg-[#006] text-white flex flex-row justify-between items-center shadow-md">
            <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Zurück"
            >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex flex-col items-center text-center">
                <span className="text-lg font-semibold ">{groupName}</span>
                <span className="text-sm ">ID: {groupId}</span>
            </div>

            <div>
                <img
                    src={groupImage}
                    className="w-10 h-10 rounded-full object-cover border"
                />
            </div>
        </header>
    );
}
