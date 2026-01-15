import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return createPortal(
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-full duration-500 pointer-events-none`}>
            <div className={`border-4 border-black px-10 py-5 shadow-[12px_12px_0px_#000] font-black uppercase text-2xl flex items-center gap-4 ${type === 'success' ? 'bg-[#FFD600] text-black' : 'bg-red-500 text-white'
                }`}>
                <span className="text-4xl">{type === 'success' ? '⚡' : '🔥'}</span>
                {message}
            </div>
        </div>,
        document.body
    );
};

export default Toast;
