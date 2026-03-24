import React, { useState } from 'react';
import { Settings, Loader2, Check, Camera, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateAccountDetails, changePassword, updateAvatar, updateCoverImage } from '../api/auth.api';
import { Link } from 'react-router-dom';

const InputField = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="bg-background-base border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent-primary/50 transition-colors placeholder:text-muted/50" />
    </div>
);

const SettingsPage = () => {
    const { user, refetchUser } = useAuth();
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [savingPwd, setSavingPwd] = useState(false);
    const [pwdMsg, setPwdMsg] = useState('');

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await updateAccountDetails({ fullName, email });
            await refetchUser();
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        } catch { /* ignore */ } finally { setSavingProfile(false); }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        const fd = new FormData(); fd.append('avatar', file);
        try { await updateAvatar(fd); await refetchUser(); } catch { /* ignore */ }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        const fd = new FormData(); fd.append('coverImage', file);
        try { await updateCoverImage(fd); await refetchUser(); } catch { /* ignore */ }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword) { setPwdMsg('Both fields are required.'); return; }
        setSavingPwd(true); setPwdMsg('');
        try {
            await changePassword({ oldPassword, newPassword });
            setPwdMsg('Password changed successfully!');
            setOldPassword(''); setNewPassword('');
        } catch (err) {
            setPwdMsg(err.response?.data?.message || 'Failed to change password.');
        } finally { setSavingPwd(false); }
    };

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-text-secondary">
            <Settings size={48} className="text-muted" />
            <p className="text-lg">Sign in to access settings</p>
            <Link to="/login" className="px-6 py-2.5 bg-accent-primary text-white font-bold rounded-lg">Sign In</Link>
        </div>
    );

    return (
        <div className="p-4 md:p-8 w-full max-w-2xl mx-auto pb-20">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Settings size={24} className="text-accent-primary" /> Settings
            </h1>

            {/* Avatar + Cover */}
            <div className="glass rounded-2xl border border-white/5 p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Profile Images</h2>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative group">
                            <img src={user.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-white/10" />
                            <label htmlFor="settings-avatar" className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera size={20} className="text-white" />
                            </label>
                            <input id="settings-avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <p className="text-xs text-text-secondary text-center">Avatar</p>
                    </div>
                    <div className="flex-1">
                        <div className="relative group rounded-xl overflow-hidden w-full h-24 bg-surface-elevated border border-white/10">
                            {user.coverImage && <img src={user.coverImage} alt="" className="w-full h-full object-cover" />}
                            <label htmlFor="settings-cover" className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera size={20} className="text-white mr-2" /> <span className="text-white text-sm">Change Cover</span>
                            </label>
                            <input id="settings-cover" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                        </div>
                        <p className="text-xs text-text-secondary mt-1">Cover Image</p>
                    </div>
                </div>
            </div>

            {/* Account Details */}
            <div className="glass rounded-2xl border border-white/5 p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Account Details</h2>
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                    <InputField label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
                    <InputField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                    <div className="flex items-center gap-2 text-xs text-muted">
                        <span>Username:</span><span className="text-text-secondary font-medium">@{user.username}</span>
                        <span className="text-muted/50">(cannot be changed)</span>
                    </div>
                    <button type="submit" disabled={savingProfile}
                        className="self-start flex items-center gap-2 px-6 py-2.5 bg-accent-primary hover:bg-accent-glow text-white font-bold rounded-lg transition-colors disabled:opacity-60">
                        {savingProfile ? <Loader2 size={16} className="animate-spin" /> : profileSaved ? <Check size={16} /> : null}
                        {savingProfile ? 'Saving...' : profileSaved ? 'Saved!' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="glass rounded-2xl border border-white/5 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Lock size={18} /> Change Password</h2>
                <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                    <InputField label="Current Password" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••" />
                    <InputField label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                    {pwdMsg && <p className={`text-sm ${pwdMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{pwdMsg}</p>}
                    <button type="submit" disabled={savingPwd}
                        className="self-start flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-200 text-black font-bold rounded-lg transition-colors disabled:opacity-60">
                        {savingPwd ? <Loader2 size={16} className="animate-spin" /> : null}
                        {savingPwd ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
