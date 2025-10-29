import HeaderBar from "../components/HeaderBar.jsx";
import PageBelowHeaderBar from "../components/PageBelowHeaderBar.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config.js";

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
            formData.append("group", groupBlob, "group.json");

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
            <PageBelowHeaderBar className="flex-1 p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <div className="max-w-md mx-auto pt-6 relative">
                    {/* Soft background glow */}
                    <div className="pointer-events-none absolute inset-x-0 -top-8 mx-auto h-24 max-w-md rounded-3xl blur-2xl opacity-60 bg-gradient-to-r from-blue-300/30 via-indigo-300/30 to-purple-300/30" />

                    <Card className="relative rounded-2xl shadow-2xl shadow-black/10 border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
                        {/* Accent gradient bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl tracking-tight">Create a Group</CardTitle>
                            <CardDescription className="text-base">Name your group and optionally add an image.</CardDescription>
                        </CardHeader>

                        <CardContent className="pt-4">
                            <div className="flex flex-col gap-4">
                                <label htmlFor="group-name" className="text-sm font-medium text-gray-700">Group Name</label>
                                <Input
                                    id="group-name"
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="e.g. Weekend Warriors"
                                    className="h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
                                />

                                <label htmlFor="group-image" className="text-sm font-medium text-gray-700">Group Image</label>
                                <div className="relative">
                                    <Input
                                        id="group-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="h-12 rounded-xl border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 mt-2">
                                    <Button
                                        onClick={handleSubmit}
                                        variant="default"
                                        className="h-11 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Create
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageBelowHeaderBar>
        </div>
    );
}

export default CreateGroup;