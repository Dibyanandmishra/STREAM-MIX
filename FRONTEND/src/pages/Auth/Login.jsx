import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Email and password are required.');
            return;
        }
        setLoading(true);
        try {
            const res = await loginUser(formData);
            login(res.data?.data?.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background-base flex items-center justify-center relative p-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/80 to-background-base/50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            </div>

            <div className="relative z-10 w-full max-w-[440px] glass bg-surface/80 p-8 sm:p-10 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="w-12 h-12 bg-accent-primary rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                        <span className="text-white text-xl font-black">SM</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-text-secondary text-sm text-center">Sign in to continue to StreamMix</p>
                </div>

                {error && (
                    <div className="mb-5 p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-lg text-sm text-red-400 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
                        <div className="flex items-center bg-background-base rounded-xl border border-white/10 focus-within:border-accent-primary/50 transition-all group overflow-hidden">
                            <div className="pl-4 pr-3 text-muted group-focus-within:text-accent-primary transition-colors"><Mail size={18} /></div>
                            <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange}
                                className="w-full bg-transparent border-none outline-none text-white py-3.5 placeholder:text-muted/50" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                        <div className="flex items-center bg-background-base rounded-xl border border-white/10 focus-within:border-accent-primary/50 transition-all group overflow-hidden">
                            <div className="pl-4 pr-3 text-muted group-focus-within:text-accent-primary transition-colors"><Lock size={18} /></div>
                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange}
                                className="w-full bg-transparent border-none outline-none text-white py-3.5 placeholder:text-muted/50" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-3 text-muted hover:text-white transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3.5 mt-2 bg-accent-primary hover:bg-accent-glow text-white font-bold rounded-xl shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:shadow-[0_0_30px_rgba(255,46,99,0.5)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-text-secondary mt-8">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-white font-semibold hover:text-accent-glow transition-colors">Sign up now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
