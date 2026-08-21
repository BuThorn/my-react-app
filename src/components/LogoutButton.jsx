import React, { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';

export const LogoutButton = ({ 
    onLogout,
    className = '',
    showText = true,
 }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await onLogout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            aria-label="Logout"
            className={`flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40 ${className}`}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true"/>
            ) : (
                <LogOut className="h-4 w-4" aria-hidden="true"/>
            )}
            {showText && <span>{isLoading ? 'Logging out...' : 'Logout'}</span>}
        </button>
    );
};