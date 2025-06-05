import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    showCancel?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                message,
                                                onConfirm,
                                                confirmText = 'ОК',
                                                showCancel = false,
                                            }) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
            style={{ opacity: isOpen ? 1 : 0 }}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 ease-in-out"
                style={{
                    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
                }}
            >
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                        >
                            Отмена
                        </button>
                    )}
                    <button
                        onClick={onConfirm || onClose}
                        className="px-4 py-2 bg-[#7B5B30] text-white rounded hover:bg-[#5A3F32] transition"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};