import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ initialUser, children }) {
    const [user, setUser] = useState(initialUser || { name: "Guest" });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}


export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
