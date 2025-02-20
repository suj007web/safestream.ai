console.log("Video Skipper Content Script Loaded!");

// content.js
let videoElement = null;
let startTime = null;
let endTime = null;
let isRecording = false;
let detectVideoInterval = null;

// Improved YouTube video detection
function detectVideo() {
  // Try multiple methods to get YouTube video
  videoElement = document.querySelector('video.html5-main-video') || // YouTube main video
                document.querySelector('video.video-stream') ||       // YouTube video stream
                document.querySelector('video');                      // Fallback for other videos

  if (videoElement) {
    console.log("Video detected:", getVideoIdentifier());
    setupListeners();
    if (detectVideoInterval) {
      clearInterval(detectVideoInterval);
    }
  }
}

// Get unique identifier for YouTube videos
function getVideoIdentifier() {
  if (!videoElement) return '';
  
  // For YouTube, try to get video ID from URL
  const url = window.location.href;
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
  
  if (videoIdMatch && videoIdMatch[1]) {
    return `youtube-${videoIdMatch[1]}`;
  }
  
  // Fallback to video source or current URL
  return videoElement.src || videoElement.currentSrc || window.location.href;
}

function setupListeners() {
  if (!videoElement) return;

  // Remove existing listeners if any
  videoElement.removeEventListener("play", onPlay);
  videoElement.removeEventListener("pause", onPause);
  videoElement.removeEventListener("timeupdate", checkForSkip);

  // Add listeners
  videoElement.addEventListener("play", onPlay);
  videoElement.addEventListener("pause", onPause);
  videoElement.addEventListener("timeupdate", checkForSkip);
}

function onPlay() {
  console.log("Video is playing:", videoElement?.currentTime);
}

function onPause() {
  console.log("Video paused:", videoElement?.currentTime);
}

// Send recording status to popup
function updateRecordingStatus(isRecording) {
  chrome.runtime.sendMessage({
    action: "updateRecordingStatus",
    isRecording
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Re-detect video on each message to handle YouTube's dynamic video loading
  detectVideo();

  if (!videoElement) {
    chrome.runtime.sendMessage({ action: "noVideo" });
    return;
  }

  if (message.action === "startRecording") {
    isRecording = true;
    startTime = videoElement.currentTime;
    updateRecordingStatus(true);
    console.log("Recording started at:", startTime);
  } else if (message.action === "stopRecording") {
    isRecording = false;
    endTime = videoElement.currentTime;
    updateRecordingStatus(false);
    console.log("Recording stopped at:", endTime);

    if (startTime !== null && endTime !== null && startTime < endTime) {
      saveSkippedSection(startTime, endTime);
    }
  }
});

function saveSkippedSection(start, end) {
  const videoKey = getVideoIdentifier();
  
  chrome.storage.local.get(["skippedSections"], (data) => {
    let skippedSections = data.skippedSections || {};
    
    if (!skippedSections[videoKey]) {
      skippedSections[videoKey] = [];
    }

    // Merge overlapping sections
    const newSection = { start, end };
    skippedSections[videoKey] = mergeOverlappingSections([
      ...skippedSections[videoKey],
      newSection
    ]);

    chrome.storage.local.set({ skippedSections }, () => {
      console.log("Skipped section saved:", skippedSections);
      chrome.runtime.sendMessage({ 
        action: "sectionSaved",
        section: newSection
      });
    });
  });
}

function mergeOverlappingSections(sections) {
  if (sections.length <= 1) return sections;
  
  sections.sort((a, b) => a.start - b.start);
  const merged = [sections[0]];
  
  for (const current of sections.slice(1)) {
    const last = merged[merged.length - 1];
    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}

function checkForSkip() {
  if (!videoElement) return;
  
  const videoKey = getVideoIdentifier();
  
  chrome.storage.local.get(["skippedSections"], (data) => {
    const skippedSections = data.skippedSections || {};
    
    if (skippedSections[videoKey]) {
      skippedSections[videoKey].forEach(({ start, end }) => {
        if (videoElement && videoElement.currentTime >= start && videoElement.currentTime < end) {
          videoElement.currentTime = end;
          console.log("Skipped section:", start, "to", end);
        }
      });
    }
  });
}

// Initial detection
detectVideo();

// Set up MutationObserver to handle YouTube's dynamic content loading
const observer = new MutationObserver(() => {
  detectVideo();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Periodic check as backup
detectVideoInterval = setInterval(detectVideo, 1000);

// Clean up when navigating away
window.addEventListener('beforeunload', () => {
  if (detectVideoInterval) {
    clearInterval(detectVideoInterval);
  }
  observer.disconnect();
});