import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {API_URL} from "../config/config.js"; // ShadCN Button import

function AddGroup() {
    const { user } = useUser();
    const [groupId, setGroupId] = useState("");
    const navigate = useNavigate();

    const handleJoin = async () => {
        try {
            const url = new URL(`${API_URL}/groups/join`);
            url.searchParams.append("uid", user.uid);
            url.searchParams.append("inviteId", "#" + groupId);

            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Could not join group");
            }

            const data = await response.json();
            console.log("Successfully joined group:", data);
            navigate("/home");
        } catch (err) {
            console.error("Error joining group:", err);
            throw err;
        }
    };

    const handleCreate = () => {
        navigate("/create-group");
    };

    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar enable_back={true}/>
            <PageBelowHeaderBar className="flex-1 p-4">
                <div className="flex flex-col gap-3 max-w-sm mx-auto p-10 text-[150%]">
                    <label htmlFor="group-id">Enter Group-ID</label>
                    <input
                        id="group-id"
                        type="text"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        className="border px-2 py-1"
                        maxLength={5}
                    />

                    <Button
                        onClick={handleJoin}
                        variant="default"
                        className="bg-blue-500 text-white h-15"
                        style={{backgroundColor: "blue", color: "white"}}
                    >
                        Join
                    </Button>

                    <Button
                        onClick={handleCreate}
                        variant="default"
                        className="bg-green-500 text-white h-15 mt-10 border-5"
                        style={{backgroundColor: "rgb(200,200,200)", color: "black"}}
                    >
                        Create new group
                    </Button>
                </div>
            </PageBelowHeaderBar>
        </div>
    );
}

export default AddGroup;
