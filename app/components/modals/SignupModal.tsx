'use client';

import Modal from "./Modal";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSignupModal from "@/app/hooks/useSignupModal";
import CustomButton from "../forms/CustomButton";
import apiService from "@/app/services/apiService";
import { handleLogin } from "@/app/lib/actions";

const SignupModal = () => {
    //
    // Variables

    const router = useRouter();
    const signupModal = useSignupModal();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    //
    // Submit functionality

    const submitSignup = async () => {
        setErrors([]); // Clear previous errors
        
        const formData = {
            email: email,
            password1: password1,
            password2: password2
        }

        try {
            const response = await apiService.postWithoutToken('/api/auth/register/', JSON.stringify(formData));

            if (response.access) {
                handleLogin(response.user.pk, response.access, response.refresh);

                signupModal.close();

                router.push('/')
            } else {
                // Handle validation errors from backend
                const tmpErrors: string[] = [];
                
                if (typeof response === 'object') {
                    Object.entries(response).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            tmpErrors.push(...value);
                        } else if (typeof value === 'string') {
                            tmpErrors.push(value);
                        } else {
                            tmpErrors.push(JSON.stringify(value));
                        }
                    });
                } else {
                    tmpErrors.push('Signup failed. Please try again.');
                }

                setErrors(tmpErrors);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrors(['An error occurred during signup. Please try again.']);
        }
    }

    const content = (
        <>
            <form 
                action={submitSignup}
                className="space-y-4"
            >
                <div>
                    <label htmlFor="signup-email" className="sr-only">Email address</label>
                    <input 
                        id="signup-email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Your e-mail address" 
                        type="email" 
                        className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                    />
                </div>

                <div>
                    <label htmlFor="signup-password1" className="sr-only">Password</label>
                    <input 
                        id="signup-password1"
                        name="password1"
                        onChange={(e) => setPassword1(e.target.value)} 
                        placeholder="Your password" 
                        type="password" 
                        className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                    />
                </div>

                <div>
                    <label htmlFor="signup-password2" className="sr-only">Repeat password</label>
                    <input 
                        id="signup-password2"
                        name="password2"
                        onChange={(e) => setPassword2(e.target.value)} 
                        placeholder="Repeat password" 
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
                    onClick={submitSignup}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={signupModal.isOpen}
            close={signupModal.close}
            label="Sign up"
            content={content}
        />
    )
}

export default SignupModal;