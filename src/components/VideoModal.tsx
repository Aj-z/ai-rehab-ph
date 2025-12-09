"use client"
import React from 'react';
import { useState } from 'react';

interface VideoModalProps {
  videoId: string;
}

const VideoModal = ({ videoId }: VideoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button className="border-2 border-teal-600 text-teal-700 px-8 py-4 rounded-lg hover:bg-teal-50" onClick={handleOpen}>
        Watch Demo
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 w-full h-full">
            <div className="bg-white p-8 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <iframe
                width="1060" height="615"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="100"
                allowFullScreen
                title="YouTube Video"
              />
              <button className="absolute top-100 right-4 text-gray-600 hover:text-gray-900" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoModal;