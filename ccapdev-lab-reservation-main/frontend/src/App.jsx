import {
    createBrowserRouter,
    RouterProvider,
    Route,
    createRoutesFromElements,
} from 'react-router-dom';

import AuthProvider from './AuthProvider.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import LoginOrHome from './pages/LoginOrHome.jsx';

import Register from './pages/Register.jsx';
import LoginPage from './pages/Login.jsx';
import Page from './pages/Page.jsx';
import Root from './pages/Root.jsx';
import Reserve from './pages/content/Reserve.jsx';
import Reservations from './pages/content/Reservations.jsx';
import Edit from './pages/content/Edit.jsx';
import Profile from './pages/content/Profile.jsx'

const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<AuthProvider><Root /></AuthProvider>}>
                <Route index element={<LoginOrHome />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<LoginPage />}/>
                <Route element={<ProtectedRoute />}>
                    <Route element={<Page />}>
                        <Route path="/home" element={<Reserve/>}/>
                        <Route path="/edit/:id" element={<Edit/>}/>
                        <Route path="/reservations" element={<Reservations />}/>
                        <Route path="/profile/:id" element={<Profile/>}/>
                    </Route>
                    
                </Route>
            </Route>
        )
);

function App() {
    document.title = 'BookLabs Home';

    return <RouterProvider router={router}/>;
}

export default App;