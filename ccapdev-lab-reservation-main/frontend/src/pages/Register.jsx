import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoURL from '../assets/logo.png';
import { IconEye, IconEyeClosed } from '@tabler/icons-react';

import { useAuth } from '../AuthProvider.jsx';

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setVisible] = useState(false);
    
    const auth = useAuth();
    
    const handleSubmit = (e) => {
        e.preventDefault(); 
        auth.registerAction(username, password, confirmPassword,);
    }

    document.title = 'BookLabs Registration';

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="h-screen flex flex-col items-center justify-center">
                <img
                    src={logoURL}
                    className="w-[500px]"
                    alt="BookLabs logo"
                />
                <div className="flex flex-col items-center gap-2">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-16 flex flex-col items-center justify-center space-y-4">
                            <div className="w-full">
                                <label className="flex w-full font-sans text-fontgray font-light text-sm">Email</label>
                                <input
                                    className="block w-60 rounded-md border-0 py-2 pl-3 pr-3 font-sans text-fontgray font-semibold text-sm bg-fieldgray outline-none"
                                    type="text"
                                    name=""
                                    id=""
                                    value={username}
                                    required
                                    onChange={(e)=>setUsername(e.currentTarget.value)}
                                />
                            </div>

                            <div className="w-full relative">
                                <label className="flex w-full font-sans text-fontgray font-light text-sm">Password</label>
                                <input
                                    className="block w-60 rounded-md border-0 py-2 pl-3 pr-8 font-sans text-fontgray font-semibold text-sm bg-fieldgray outline-none"
                                    type={showPassword ? "text" : "password"}
                                    name=""
                                    id=""
                                    value={password}
                                    required
                                    onChange={(e)=>setPassword(e.currentTarget.value)}
                                />
                                {
                                    showPassword ? <IconEyeClosed 
                                                    color='#4a4747' 
                                                    size={20} 
                                                    className="absolute right-2 top-7" 
                                                    onClick={()=>setVisible(!showPassword)} />
                                                 : <IconEye 
                                                    color='#4a4747' 
                                                    size={20} 
                                                    className="absolute right-2 top-7" 
                                                    onClick={()=>setVisible(!showPassword)}/>
                                }
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
                                {
                                    showPassword ? <IconEyeClosed 
                                                    color='#4a4747' 
                                                    size={20} 
                                                    className="absolute right-2 top-7" 
                                                    onClick={()=>setVisible(!showPassword)} />
                                                 : <IconEye 
                                                    color='#4a4747' 
                                                    size={20} 
                                                    className="absolute right-2 top-7" 
                                                    onClick={()=>setVisible(!showPassword)}/>
                                }
                            </div>

                            <button
                                type="submit"
                                className="w-full py-1.5 !mt-10 rounded-full bg-linkblue text-white font-bold text-[20px] shadow hover:shadow-md"
                            >
                                REGISTER
                            </button>
                            <Link to={"/login"}>Already a user? Login now</Link>

                        </div>
                    </form>
                </div>
            </div>
        </div  >
    );
}
