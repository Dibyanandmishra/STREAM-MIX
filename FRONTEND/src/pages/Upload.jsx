import React, { useState } from 'react';
import { UploadCloud, X, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { publishVideo } from '../api/video.api';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dragging, setDragging] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [success, setSuccess] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setError('');
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) { setError('Please select a video file.'); return; }
        if (!title.trim()) { setError('Title is required.'); return; }
        setError('');
        setUploading(true);
        setUploadProgress(10);

        try {
            const fd = new FormData();
            fd.append('title', title.trim());
            fd.append('description', description.trim());
            fd.append('videoFile', videoFile);
            if (thumbnail) fd.append('thumbnail', thumbnail);

            // Simulate progress during upload
            const interval = setInterval(() => setUploadProgress(p => p < 85 ? p + 5 : p), 800);

            await publishVideo(fd);
            clearInterval(interval);
            setUploadProgress(100);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-text-secondary gap-4">
            <p>Please sign in to upload videos.</p>
        </div>
    );

    if (success) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Video Uploaded Successfully!</h2>
            <p className="text-text-secondary">Redirecting to home...</p>
        </div>
    );

    return (
        <div className="min-h-screen w-full flex items-start justify-center py-10 px-4">
            <div className="w-full max-w-4xl bg-surface glass rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="p-8 border-b border-white/5">
                    <h1 className="text-2xl font-bold text-white">Upload Video</h1>
                    <p className="text-text-secondary mt-1">Share your content with the world</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8">
                    {/* Drop Zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl py-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
              ${dragging ? 'border-accent-glow bg-accent-primary/5' : videoFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}`}>
                        <label className="absolute inset-0 cursor-pointer" htmlFor="video-file-input"></label>
                        <input id="video-file-input" type="file" accept="video/*" className="hidden" onChange={e => { setVideoFile(e.target.files[0]); setError(''); }} />

                        {videoFile ? (
                            <>
                                <CheckCircle size={40} className="text-green-500" />
                                <div className="text-center">
                                    <p className="text-white font-semibold">{videoFile.name}</p>
                                    <p className="text-text-secondary text-sm mt-1">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                                </div>
                                <button type="button" onClick={() => setVideoFile(null)} className="mt-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-elevated hover:bg-white/10 text-sm text-text-secondary transition-colors z-10 relative">
                                    <X size={14} /> Remove
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                                    <UploadCloud size={32} className="text-accent-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold text-lg">Drag & Drop your video</p>
                                    <p className="text-text-secondary text-sm mt-1">or <span className="text-accent-glow hover:underline cursor-pointer">browse files</span></p>
                                </div>
                                <p className="text-muted text-xs">Supports MP4, MOV, AVI, WEBM</p>
                            </>
                        )}
                    </div>

                    {/* Progress */}
                    {uploading && (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Uploading to Cloudinary...</span>
                                <span className="text-white font-medium">{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                                <div className="h-full bg-accent-primary rounded-full transition-all duration-500" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}

                    {/* Fields & Thumbnail */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary">Video Title <span className="text-accent-primary">*</span></label>
                                <input type="text" placeholder="Enter a catchy title..." value={title} onChange={e => setTitle(e.target.value)}
                                    className="bg-background-base rounded-xl border border-white/10 focus:border-accent-primary/50 outline-none text-white px-4 py-3 text-sm transition-colors placeholder:text-muted/50" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary">Description</label>
                                <textarea placeholder="Tell viewers about your video..." value={description} onChange={e => setDescription(e.target.value)} rows={5}
                                    className="bg-background-base rounded-xl border border-white/10 focus:border-accent-primary/50 outline-none text-white px-4 py-3 text-sm transition-colors resize-none placeholder:text-muted/50" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-secondary">Thumbnail</label>
                            <label htmlFor="thumbnail-input" className="relative w-full aspect-video bg-background-base rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center cursor-pointer overflow-hidden transition-all group">
                                {thumbnailPreview ? (
                                    <>
                                        <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-sm">
                                            Change Thumbnail
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-text-secondary">
                                        <UploadCloud size={28} />
                                        <p className="text-sm">Upload thumbnail</p>
                                        <p className="text-xs text-muted">PNG, JPG — 1280×720 recommended</p>
                                    </div>
                                )}
                            </label>
                            <input id="thumbnail-input" type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-lg text-sm text-red-400">{error}</div>
                    )}

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => navigate('/')} disabled={uploading}
                            className="px-6 py-2.5 bg-surface-elevated hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/10 disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={uploading || !videoFile}
                            className="flex items-center gap-2 px-8 py-2.5 bg-accent-primary hover:bg-accent-glow text-white font-bold rounded-lg shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:shadow-[0_0_25px_rgba(255,46,99,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <>Publish Video</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;
