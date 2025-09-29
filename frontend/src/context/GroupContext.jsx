import { createContext, useContext, useState } from "react";

const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
    const [group, setGroup] = useState(null);

    return (
        <GroupContext.Provider value={{ group, setGroup }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroup = () => useContext(GroupContext);
