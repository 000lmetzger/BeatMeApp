import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function CreateGroup() {
    const { user } = useUser();
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);

    const handleSubmit = () => {
        // API-Call wird hier später eingefügt
        console.log("Creating group:", groupName, groupImage);
    };

    const handleFileChange = (e) => {
        setGroupImage(e.target.files[0]);
    };

    return (
        <div className="h-screen w-screen flex flex-col">
            <HeaderBar user={user}>
                <h1 className="mt-0 mb-0">Create Group</h1>
            </HeaderBar>
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
