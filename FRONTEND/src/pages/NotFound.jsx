import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-text-secondary">
            <div className="text-6xl font-bold text-white">404</div>
            <div className="text-lg">Page not found</div>
            <Link
                to="/"
                className="px-6 py-2.5 bg-accent-primary text-white font-bold rounded-lg hover:bg-accent-glow transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;

