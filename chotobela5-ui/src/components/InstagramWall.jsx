import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Mic } from 'lucide-react';
import API from '../services/api';

const BASE_URL = API.defaults.baseURL.replace("/api", "");

export default function InstagramWall({ memories }) {
    if (!memories || memories.length === 0) return (
        <div className="w-full max-w-4xl mx-auto text-center py-20 px-4">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Memories Yet</h3>
            <p className="text-gray-500">Be the first to share a memory! Toggle back to "Share Memory" above.</p>
        </div>
    );

    return (
        <>
            <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl mx-auto flex flex-col pt-4 pb-20 px-2 sm:px-4"
            >
                {/* Header Title (Inline) */}
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px] flex-shrink-0 shadow-md">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 font-bold text-lg">MW</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-english mb-0.5">Memory Wall</h2>
                        <p className="text-sm text-gray-500 font-medium">{memories.length} {memories.length === 1 ? 'post' : 'posts'}</p>
                    </div>
                </div>

                {/* Grid Container natively scrolls directly on the window document */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5 p-2 sm:p-4">
                    {memories.map((m, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-white border border-gray-200 p-2 sm:p-3 relative overflow-hidden shadow-sm pic-grid rounded-xl sm:rounded-2xl flex flex-col items-center justify-center"
                        >
                            <div className="w-full h-full relative rounded-lg overflow-hidden bg-gray-100">
                                {m.type === 'photo' ? (
                                    m.image_url ? (
                                        <img src={`${BASE_URL}/${m.image_url}`} alt="Memory thumbnail" className="w-full h-full object-cover" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center p-2 text-center text-white text-xs">
                                            <Camera className="w-8 h-8 opacity-40" />
                                        </div>
                                    )
                                ) : null}
                                {m.type === 'video' && (
                                    <>
                                        <video src={`${BASE_URL}/${m.video_url}`} className="w-full h-full object-cover" preload="metadata" />
                                        <div className="absolute top-2 right-2 bg-black/40 rounded-full p-1 border border-white/20">
                                            <Video className="w-4 h-4 text-white drop-shadow-md" />
                                        </div>
                                    </>
                                )}
                                {m.type === 'audio' && (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center">
                                        <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md mb-2" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}
