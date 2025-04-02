import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider.jsx";

export default function LoginOrHome() {
    const auth = useAuth();
    const navigate = useNavigate();

    console.log("🔍 AuthContext:", auth); 
    console.log("Auth user:", auth.user);

    if (!auth) {
        return <h1>Error: AuthContext is undefined</h1>;
    }

    useEffect(() => {
        if (auth.user) {
            navigate("/home");
            return (
                <div>
                    <h1>Welcome, {auth.user ? auth.user.name : "Guest"}!</h1>
                </div>
            );
        } else {
            navigate("/login");
        }
    }, [auth.user, navigate]);

    return null;
}