import { useRef, useState, useContext } from "react";
import ModalDialog from "./ModalDialog";
import { useTodoAppState } from "../context/TodoAppContext";

type UsernameRef = {
    startSubmit: () => void;
}

export default function NameInput() {
    const [name, setName] = useState<string>("");
    const { activeUser, actions } = useTodoAppState();
    const usernameRef = useRef<UsernameRef>(null);

    const handleOkButton = () => {
        actions.setActiveUser(name);
    }

    const handleCancelButton = () => {
        actions.setActiveUser("Guest");
    }

    return (
        <ModalDialog
            title={"Enter your name"}
            onOk={handleOkButton}
            onCancel={handleCancelButton}
        >
            <input 
                type="text" 
                placeholder="Your username" 
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </ModalDialog>
    );
}