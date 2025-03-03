import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(localStorage.getItem("user") || "");
    const navigate = useNavigate();

    const loginAction = async (username, password, remember) => {
        console.log(username)
        console.log(password)
        console.log(remember)

        // TODO: send login request to server


        // TODO: check server response
        // if response is ok
        // TODO: replace this with actual logic
        if (username == "lab") {
            setUser("lab");
            localStorage.setItem("user", "lab");
        } else {
            setUser("student");
            localStorage.setItem("user", "student");
        }
        
        navigate("/home");

        // else, alert wrong credentials
        // alert('Incorrect credentials');
    }

    const registerAction = async (username, password) => {
        console.log(username)
        console.log(password)

        // TODO: send register request to server


        // TODO: check server response
        // if response is ok
        // TODO: replace this with actual logic

        navigate("/login");

        // else, alert taken email address
        // alert('Email has been registered already');
    }

    const logoutAction = async () => {
        // TODO: send logout request to server
        
        setUser("");
        navigate("/login");
    }

    return <AuthContext.Provider value={{ user, loginAction, registerAction, logoutAction }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};