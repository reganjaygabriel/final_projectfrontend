'use client';

import Modal from "./Modal";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import useLoginModal from "@/app/hooks/useLoginModal";
import CustomButton from "../forms/CustomButton";
import { handleLogin } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";

const LoginModal = () => {
    const router = useRouter()
    const loginModal = useLoginModal()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const submitLogin = async () => {
        setErrors([]);

        const formData = {
            email: email,
            password: password
        }

        try {
            const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formData))

            if (response.access) {
                handleLogin(response.user.pk, response.access, response.refresh);

                loginModal.close();

                router.push('/')
            } else {
                const tmpErrors: string[] = [];
                if (response.non_field_errors) tmpErrors.push(...response.non_field_errors);
                if (response.email) tmpErrors.push(...response.email);
                if (response.password) tmpErrors.push(...response.password);
                setErrors(tmpErrors.length ? tmpErrors : ['Login failed']);
            }
        } catch (error: any) {
            const tmpErrors: string[] = [];
            // Try to parse JSON error body from error.message
            try {
                const jsonStart = error?.message?.indexOf('{');
                if (jsonStart !== -1) {
                    const jsonStr = error.message.slice(jsonStart);
                    const obj = JSON.parse(jsonStr);
                    Object.values(obj).forEach((val: any) => {
                        if (Array.isArray(val)) {
                            tmpErrors.push(...val.map((v) => String(v)));
                        } else {
                            tmpErrors.push(String(val));
                        }
                    })
                }
            } catch {}

            setErrors(tmpErrors.length ? tmpErrors : ['Login failed. Please check your email and password.']);
        }
    }

    const content = (
        <>
            <form 
                onSubmit={(e) => { e.preventDefault(); submitLogin(); }}
                className="space-y-4"
            >
                <div>
                    <label htmlFor="login-email" className="sr-only">Email address</label>
                    <input 
                        id="login-email"
                        name="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Your e-mail address" 
                        type="email" 
                        className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                    />
                </div>

                <div>
                    <label htmlFor="login-password" className="sr-only">Password</label>
                    <input 
                        id="login-password"
                        name="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Your password" 
                        type="password" 
                        className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                    />
                </div>
            
                {errors.map((error, index) => {
                    return (
                        <div 
                            key={`error_${index}`}
                            className="p-5 bg-airbnb text-white rounded-xl opacity-80"
                        >
                            {error}
                        </div>
                    )
                })}

                <CustomButton
                    label="Submit"
                    onClick={submitLogin}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Log in"
            content={content}
        />
    )
}

export default LoginModal;