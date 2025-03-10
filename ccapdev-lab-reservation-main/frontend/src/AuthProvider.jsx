import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) ?? null;
    });

    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    
    const loginAction = async (email, password, remember) => {
        setErrorMessage(""); // Clear previous errors
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
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

            // Store user and token based on "remember me" option
            if (remember) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
            } else {
                sessionStorage.setItem("user", JSON.stringify(data.user));
                sessionStorage.setItem("token", data.token);
            }

            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage(error.message); // Display error message to UI
            alert(error.message); 
        }
    };

    const registerAction = async (email, password) => {
        setErrorMessage(""); // Clear previous errors
        
        console.log("Sending request with:", { email, password }); // Debugging log

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Email has been registered already");
            }

            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            setErrorMessage(error.message); // Display error message to UI
            alert(error.message); 
        }
    };
    
    const logoutAction = () => {
        setUser(null);
        // Remove both localStorage and sessionStorage for a full logout
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, errorMessage, loginAction, registerAction, logoutAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
