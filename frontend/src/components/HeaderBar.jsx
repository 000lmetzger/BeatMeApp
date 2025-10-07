import BackwardsButton from "./BackwardsButton.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

function HeaderBar({ enable_back }) {
    const navigate = useNavigate();
    const { user } = useUser();

    const onBack = () => {
        navigate("/home");
    };

    return (
        <nav
            className="sticky top-0 z-50 bg-gradient-to-r from-[#003366] to-[#0055aa] text-white flex items-center justify-between px-6 shadow-md"
            style={{ minHeight: "12vh", fontSize: "1.6rem" }}
        >
            <div className="flex items-center">
                {enable_back && <BackwardsButton onBack={onBack} />}
            </div>

            <div className="text-center flex-1 font-semibold tracking-wide">
                {user.username || "Guest"}
            </div>

            <div className="w-1/3 flex justify-end">
                {user.profilePicture ? (
                    <img
                        src={user.profilePicture}
                        className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                ) : (
                    <div className="h-14 w-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold border-2 border-white shadow-md">
                        ?
                    </div>
                )}
            </div>
        </nav>
    );
}

export default HeaderBar;
