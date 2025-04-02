import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";

import AuthProvider from "./AuthProvider.jsx"; // ✅ Use the updated AuthProvider
import { useAuth } from "./AuthProvider.jsx"; // ✅ Import `useAuth` from the same file

import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import LoginOrHome from "./pages/LoginOrHome.jsx";
import Register from "./pages/Register.jsx";
import LoginPage from "./pages/Login.jsx";
import Page from "./pages/Page.jsx";
import Root from "./pages/Root.jsx";
import Reserve from "./pages/content/Reserve.jsx";
import Reservations from "./pages/content/Reservations.jsx";
import Edit from "./pages/content/Edit.jsx";
import Profile from "./pages/content/Profile.jsx";
import Users from "./pages/content/Users.jsx";
import { SocketProvider } from "./context/SocketContext.jsx"; // ✅ Import WebSocket Context

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route index element={<LoginOrHome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<Page />}>
                    <Route path="/home" element={<Reserve />} />
                    <Route path="/edit/:id" element={<Edit />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/users" element={<Users />} />
                </Route>
            </Route>
        </Route>
    )
);

function App() {
    return (
        <AuthProvider> {/* ✅ Ensure this wraps your app */}
            <SocketProvider>
                <RouterProvider router={router} />
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;


/* Some of the most common mistakes during MCO1:
<ul>
<li>Some registration pages forgot to add a confirm password.</li>
<li>The edit pages and delete buttons are needed.</li>
<li>For lab reservation, try to visualize how it would be used by the technician, not only a student/user.</li> */
