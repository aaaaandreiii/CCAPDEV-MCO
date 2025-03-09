import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) ?? null;
    });
    const navigate = useNavigate();
    
    const loginAction = async (username, password, remember) => {
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: username, password }) 
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Invalid credentials");
            }
    
            const data = await response.json();
            console.log("Login response data:", data); 
    
            if (!data.user) {
                console.error("No user data received!");
                return;
            }
    
            
            setUser(data.user);
            console.log("User set in state:", data.user);

            if(remember){
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
            }
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message);
        }
    };

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
    };

    const logoutAction = () => {
        setUser("");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loginAction, registerAction, logoutAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
