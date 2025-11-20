import React, { useState } from 'react';
import supabase from './supabaseClient';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) setMessage(error.message);
        else setMessage('Signed in');
        console.log(data);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error) setMessage(error.message);
        else setMessage('Check your email for confirmation');
        console.log(data);
    };

    return (
        <div>
            <h2>Login / Sign Up</h2>
            <form>
                <div>
                    <label>Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
                <div>
                    <label>Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                </div>
                <button onClick={handleSignIn} disabled={loading}>Sign In</button>
                <button onClick={handleSignUp} disabled={loading}>Sign Up</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}