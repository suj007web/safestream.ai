import  { useState, useEffect } from 'react';
import { Circle,  Square } from 'lucide-react';

const Popup = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "updateRecordingStatus") {
        setIsRecording(message.isRecording);
      } else if (message.action === "noVideo") {
        setHasVideo(false);
      } else if (message.action === "sectionSaved") {
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
      }
    });
  }, []);

  const sendMessageToContentScript = (action: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action });
      }
    });
  };

  if (!hasVideo) {
    return (
      <div className="w-64 p-4 text-center">
        <h1 className="text-lg font-bold text-gray-800">Video Skipper</h1>
        <p className="text-sm text-red-500 mt-2">No video detected on this page</p>
      </div>
    );
  }

  return (
    <div className="w-64 p-4 text-center">
      <h1 className="text-lg font-bold text-gray-800">Video Skipper</h1>
      <p className="text-sm text-gray-600 mt-2">
        {isRecording ? 'Recording in progress...' : 'Skip unwanted parts of videos'}
      </p>
      
      {!isRecording ? (
        <button
          onClick={() => sendMessageToContentScript("startRecording")}
          className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 transition-all duration-200 transform hover:scale-105"
        >
          <Circle className="w-4 h-4 mr-2 animate-pulse text-red-500" />
          Start Recording
        </button>
      ) : (
        <button
          onClick={() => sendMessageToContentScript("stopRecording")}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4 transition-all duration-200 transform hover:scale-105"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop & Save
        </button>
      )}

      {showSavedMessage && (
        <div className="mt-4 text-green-500 text-sm animate-fade-in">
          Section saved successfully!
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        {isRecording && (
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping mr-2" />
            Recording in progress
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;

