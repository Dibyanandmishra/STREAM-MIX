import React from 'react';
import { HelpCircle, MessageSquare, Book, Mail, ExternalLink } from 'lucide-react';

const HelpCard = ({ icon: Icon, title, description, action, href }) => (
    <div className="glass rounded-2xl border border-white/5 hover:border-white/15 p-6 flex flex-col gap-3 transition-all group">
        <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
            <Icon size={20} className="text-accent-primary" />
        </div>
        <h3 className="text-white font-bold">{title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
        {href && <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-accent-glow text-sm font-medium hover:text-white transition-colors flex items-center gap-1 mt-auto">
            {action} <ExternalLink size={14} />
        </a>}
    </div>
);

const Help = () => (
    <div className="p-4 md:p-8 w-full max-w-4xl mx-auto pb-20">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <HelpCircle size={26} className="text-accent-primary" /> Help & Support
        </h1>
        <p className="text-text-secondary mb-8">Find answers to common questions and get support for StreamMix.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            <HelpCard icon={Book} title="Getting Started" description="Learn how to use StreamMix, upload videos, manage your channel, and more." action="Read Documentation" href="#" />
            <HelpCard icon={MessageSquare} title="Community Forum" description="Ask questions and get help from other StreamMix creators and viewers." action="Go to Forum" href="#" />
            <HelpCard icon={Mail} title="Contact Support" description="Can't find your answer? Reach out to our support team directly." action="Send Email" href="mailto:support@streammix.com" />
            <HelpCard icon={HelpCircle} title="FAQ" description="Answers to the most frequently asked questions about StreamMix." action="View FAQ" href="#" />
        </div>

        <div className="glass rounded-2xl border border-white/5 p-8">
            <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-4">
                {[
                    { q: 'How do I upload a video?', a: 'Click the "Upload" button in the top navigation bar to go to the upload page. Select your video file, add a title and description, choose a thumbnail, and click "Publish Video".' },
                    { q: 'How do I subscribe to a channel?', a: 'Visit a channel page and click the "Subscribe" button. You can manage your subscriptions from the Subscriptions page in the sidebar.' },
                    { q: 'How do I create a playlist?', a: 'Go to the Playlists page from the sidebar and click "New Playlist". Give it a name and description. Videos can be added to playlists from the Watch page.' },
                    { q: 'How do I change my avatar?', a: 'Go to Settings from the sidebar and click your avatar image to upload a new one.' },
                    { q: 'Why are my videos private?', a: 'When you upload a video, you can toggle its publish status from the Dashboard. Private videos are only visible to you.' },
                ].map(({ q, a }) => (
                    <details key={q} className="group border-b border-white/5 pb-4">
                        <summary className="text-white font-medium cursor-pointer list-none flex justify-between items-center gap-4 hover:text-accent-glow transition-colors">
                            {q}
                            <span className="text-muted text-lg group-open:rotate-45 transition-transform">+</span>
                        </summary>
                        <p className="text-text-secondary text-sm mt-3 leading-relaxed">{a}</p>
                    </details>
                ))}
            </div>
        </div>
    </div>
);

export default Help;
