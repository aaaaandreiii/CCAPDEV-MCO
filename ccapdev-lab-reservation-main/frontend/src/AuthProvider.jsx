import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("❌ useAuth() must be used within an AuthProvider!");
    }
    return context;
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) ?? null; 
    });

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const registerAction = async (email, password, confirmPassword) => {
        setErrorMessage(""); // Clear previous errors
    
        email = email.trim().toLowerCase();
    
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, confirmPassword }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                console.error("Server Error:", data.message);
                throw new Error(data.message || "Registration failed");
            }
    
            alert(data.message);
            navigate("/login");
        } catch (error) {
            console.error("❌ Registration error:", error.message);
            setErrorMessage(error.message);
            alert(error.message);
        }
    };    

    const loginAction = async (email, password, remember) => {
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Invalid credentials");
            }

            const data = await response.json();

            if (!data.user) {
                console.error("No user data received!");
                return;
            }

            setUser(data.user);

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
            setErrorMessage(error.message);
            alert(error.message);
        }
    };

    const logoutAction = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loginAction, logoutAction, registerAction, errorMessage }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;