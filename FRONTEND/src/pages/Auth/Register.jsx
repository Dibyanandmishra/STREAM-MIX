import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { registerUser } from '../../api/auth.api';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
            setError('All fields are required.'); return;
        }
        if (!avatar) { setError('Avatar image is required.'); return; }
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
            fd.append('avatar', avatar);
            if (coverImage) fd.append('coverImage', coverImage);
            await registerUser(fd);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background-base flex items-center justify-center relative p-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/80 to-background-base/50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-glow/10 rounded-full blur-[120px] pointer-events-none"></div>
            </div>

            <div className="relative z-10 w-full max-w-[480px] glass bg-surface/80 p-8 sm:p-10 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-text-secondary text-sm text-center">Join StreamMix and start discovering</p>
                </div>

                {error && (
                    <div className="mb-5 p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-lg text-sm text-red-400 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {[
                        { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'John Doe', Icon: User },
                        { label: 'Username', name: 'username', type: 'text', placeholder: 'johndoe', Icon: User },
                        { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com', Icon: Mail },
                    ].map(({ label, name, type, placeholder, Icon }) => (
                        <div key={name} className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary ml-1">{label}</label>
                            <div className="flex items-center bg-background-base rounded-xl border border-white/10 focus-within:border-accent-primary/50 transition-all group overflow-hidden">
                                <div className="pl-4 pr-3 text-muted group-focus-within:text-accent-primary transition-colors"><Icon size={18} /></div>
                                <input type={type} name={name} placeholder={placeholder} value={formData[name]} onChange={handleChange}
                                    className="w-full bg-transparent border-none outline-none text-white py-3 placeholder:text-muted/50" />
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                        <div className="flex items-center bg-background-base rounded-xl border border-white/10 focus-within:border-accent-primary/50 transition-all group overflow-hidden">
                            <div className="pl-4 pr-3 text-muted group-focus-within:text-accent-primary transition-colors"><Lock size={18} /></div>
                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange}
                                className="w-full bg-transparent border-none outline-none text-white py-3 placeholder:text-muted/50" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-3 text-muted hover:text-white transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary ml-1">Avatar <span className="text-accent-primary">*</span></label>
                            <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} className="text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-surface-elevated file:text-white file:text-xs file:cursor-pointer hover:file:bg-white/10 bg-background-base border border-white/10 rounded-xl p-2 cursor-pointer" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary ml-1">Cover Image</label>
                            <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files[0])} className="text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-surface-elevated file:text-white file:text-xs file:cursor-pointer hover:file:bg-white/10 bg-background-base border border-white/10 rounded-xl p-2 cursor-pointer" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3.5 mt-2 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-text-secondary mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white font-semibold hover:text-accent-glow transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
