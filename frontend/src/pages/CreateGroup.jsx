import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../config/config.js";

function CreateGroup() {
    const { user } = useUser();
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!groupName) {
            alert("Please enter a group name");
            return;
        }

        try {
            const formData = new FormData();

            const groupData = {
                groupName,
                ownerID: user.uid,
                userList: [],
            };
            const groupBlob = new Blob([JSON.stringify(groupData)], {
                type: "application/json",
            });
            formData.append("group", groupBlob, "group.json"); // <-- hier Filename hinzufügen

            if (groupImage) {
                formData.append("groupPic", groupImage);
            }

            const token = localStorage.getItem("firebaseToken");
            const headers = {
                "Authorization": `Bearer ${token}`
            };

            const response = await fetch(`${API_URL}/groups`, {
                method: "POST",
                headers,
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                console.error("Could not create group:", errData.error || "Unknown error");
                return;
            }

            const data = await response.json();
            console.log("Group successfully created:", data);
            navigate("/home");

        } catch (err) {
            console.error("Error creating group:", err);
        }
    };


    const handleFileChange = (e) => {
        setGroupImage(e.target.files[0]);
    };

    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar enable_back={true}/>
            <PageBelowHeaderBar className="flex-1 p-4">
                <div className="flex flex-col gap-3 max-w-sm mx-auto p-10 text-[150%]">
                    <label htmlFor="group-name">Group Name</label>
                    <input
                        id="group-name"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="border px-2 py-1"
                    />

                    <label htmlFor="group-image">Group Image</label>
                    <input
                        id="group-image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border px-2 py-1 h-50"
                    />

                    <Button style={{backgroundColor: "green"}} onClick={handleSubmit} variant="default" className="bg-green-500 h-15 text-white">
                        Create
                    </Button>
                </div>
            </PageBelowHeaderBar>
        </div>
    );
}

export default CreateGroup;
