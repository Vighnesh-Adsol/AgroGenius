import React, { useState, useRef, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const ImageDetect = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (5MB limit)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                setImage(base64String);
                setImagePreview(base64String);
                setLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error processing image:", error);
            toast.error("Failed to process image");
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!text.trim() && !image) {
            toast.error("Please provide text or image");
            return;
        }

        // Check image size before sending
        if (image) {
            const base64Length = image.split(',')[1].length;
            const sizeInBytes = base64Length * 0.75; // Convert base64 length to bytes
            const MAX_SIZE = 1 * 1024 * 1024; // 1MB limit
            if (sizeInBytes > MAX_SIZE) {
                toast.error("Image size is too large (max 1MB)");
                return;
            }
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/api/ai/generate', {
                prompt: text.trim(),
                image: image
            });

            if (response.data && response.data.response) {
                setMessages(prev => [
                    ...prev,
                    { text: text.trim(), sender: 'user', image: image },
                    { text: response.data.response, sender: 'ai' }
                ]);
                setText('');
                setImage(null);
                setImagePreview(null);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 413) {
                toast.error("Image size is too large (max 1MB)");
            } else {
                toast.error(error.response?.data?.error || "Failed to get AI response");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-base-200">
            <div className="navbar bg-base-100 shadow-lg">
                <div className="flex-1">
                    <span className="text-xl font-bold px-4">AI Image Assistant</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} 
                         className={`chat ${message.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
                        <div className={`chat-bubble ${
                            message.sender === 'user' 
                                ? 'chat-bubble-primary' 
                                : 'chat-bubble-secondary'
                        }`}>
                            {message.image && (
                                <img 
                                    src={message.image} 
                                    alt="User upload" 
                                    className="max-w-xs rounded-lg mb-2"
                                />
                            )}
                            {message.sender === 'ai' ? (
                                <div className="prose prose-invert max-w-none">
                                    <ReactMarkdown>
                                        {message.text}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-base-content">{message.text}</p>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-base-100">
                {imagePreview && (
                    <div className="mb-4">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-40 rounded-lg"
                        />
                        <button 
                            onClick={() => {
                                setImage(null);
                                setImagePreview(null);
                            }}
                            className="btn btn-circle btn-error btn-sm absolute -mt-4 -ml-4"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Ask about the image..."
                        className="input input-bordered flex-1"
                        disabled={loading}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageInput"
                    />
                    <label 
                        htmlFor="imageInput"
                        className="btn btn-circle btn-outline"
                    >
                        📷
                    </label>
                    <button
                        onClick={handleSendMessage}
                        disabled={loading}
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageDetect;