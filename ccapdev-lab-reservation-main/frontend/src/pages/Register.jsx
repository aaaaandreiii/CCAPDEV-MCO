import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoURL from '../assets/logo.png';
import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import { useAuth } from '../AuthProvider.jsx';

export default function Register() {
    const { registerAction } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Registering with:", { email, password, confirmPassword });
        await registerAction(email, password, confirmPassword, "user");  // Pass "user" as default role
    };    

    document.title = 'BookLabs Registration';

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="h-screen flex flex-col items-center justify-center">
                <img src={logoURL} className="w-[500px]" alt="BookLabs logo" />
                <div className="flex flex-col items-center gap-2">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-16 flex flex-col items-center justify-center space-y-4">
                            {/* Email Field */}
                            <div className="w-full">
                                <label className="flex w-full font-sans text-fontgray font-light text-sm">Email</label>
                                <input
                                    className="block w-60 rounded-md border-0 py-2 pl-3 pr-3 font-sans text-fontgray font-semibold text-sm bg-fieldgray outline-none"
                                    type="email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="w-full relative">
                                <label className="flex w-full font-sans text-fontgray font-light text-sm">Password</label>
                                <input
                                    className="block w-60 rounded-md border-0 py-2 pl-3 pr-8 font-sans text-fontgray font-semibold text-sm bg-fieldgray outline-none"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.currentTarget.value)}
                                />
                                {showPassword ? (
                                    <IconEyeClosed color='#4a4747' size={20} className="absolute right-2 top-7" onClick={() => setVisible(!showPassword)} />
                                ) : (
                                    <IconEye color='#4a4747' size={20} className="absolute right-2 top-7" onClick={() => setVisible(!showPassword)} />
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="w-full relative">
                                <label className="flex w-full font-sans text-fontgray font-light text-sm">Confirm Password</label>
                                <input
                                    className="block w-60 rounded-md border-0 py-2 pl-3 pr-8 font-sans text-fontgray font-semibold text-sm bg-fieldgray outline-none"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    required
                                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                                />
                                {showPassword ? (
                                    <IconEyeClosed color='#4a4747' size={20} className="absolute right-2 top-7" onClick={() => setVisible(!showPassword)} />
                                ) : (
                                    <IconEye color='#4a4747' size={20} className="absolute right-2 top-7" onClick={() => setVisible(!showPassword)} />
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-1.5 !mt-10 rounded-full bg-linkblue text-white font-bold text-[20px] shadow hover:shadow-md"
                            >
                                REGISTER
                            </button>
                            <Link to="/login">Already a user? Login now</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
