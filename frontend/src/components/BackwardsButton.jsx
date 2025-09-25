import {ArrowLeft} from "lucide-react";

function BackwardsButton( {onBack} ){
    return(
        <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition w-[15%]"
            aria-label="Zurück"
        >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
    )
}

export default BackwardsButton;