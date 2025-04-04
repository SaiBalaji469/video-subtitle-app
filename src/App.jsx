import { useState, useRef } from 'react';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [captions, setCaptions] = useState('');
  const [timestamps, setTimestamps] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const captionLines = captions.trim().split('\n');
    const timestampLines = timestamps.trim().split('\n').map(Number);

    if (!videoUrl.endsWith('.mp4')) {
      alert("Please use a direct .mp4 video URL");
      return;
    }

    if (captionLines.length !== timestampLines.length) {
      alert("Captions and timestamps count must match.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff9e6] to-[#fff2cc] p-6">
      <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-[#ffd966]/20">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#cc9900] tracking-tight">
          🎬 Video Subtitle App
        </h1>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#997300] mb-1">Video URL</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter .mp4 video URL"
                className="w-full border-2 border-[#ffd966] focus:border-[#ffbf00] focus:ring-2 focus:ring-[#ffd966]/50 p-4 rounded-xl transition-all duration-200 placeholder-[#997300]/50 bg-white/80 shadow-sm hover:border-[#ffcc33]"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-[#997300]">📹</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#997300] mb-1">Captions</label>
            <div className="relative">
              <textarea
                placeholder="Enter captions (one per line)"
                className="w-full border-2 border-[#ffd966] focus:border-[#ffbf00] focus:ring-2 focus:ring-[#ffd966]/50 p-4 rounded-xl transition-all duration-200 placeholder-[#997300]/50 bg-white/80 shadow-sm hover:border-[#ffcc33] min-h-[120px] resize-none"
                rows="4"
                value={captions}
                onChange={(e) => setCaptions(e.target.value)}
              />
              <div className="absolute top-4 right-4">
                <span className="text-[#997300]">✍️</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#997300] mb-1">Timestamps</label>
            <div className="relative">
              <textarea
                placeholder="Enter timestamps in seconds (one per line)"
                className="w-full border-2 border-[#ffd966] focus:border-[#ffbf00] focus:ring-2 focus:ring-[#ffd966]/50 p-4 rounded-xl transition-all duration-200 placeholder-[#997300]/50 bg-white/80 shadow-sm hover:border-[#ffcc33] min-h-[120px] resize-none"
                rows="4"
                value={timestamps}
                onChange={(e) => setTimestamps(e.target.value)}
              />
              <div className="absolute top-4 right-4">
                <span className="text-[#997300]">⏱️</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#ffbf00] hover:bg-[#cc9900] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ffbf00]/50 focus:ring-offset-2"
          >
            Generate Subtitles
          </button>
        </div>

        {submitted && (
          <VideoPlayer
            videoUrl={videoUrl}
            captions={captions}
            timestamps={timestamps}
          />
        )}
      </div>
    </div>
  );
}

function VideoPlayer({ videoUrl, captions, timestamps }) {
  const captionArray = captions.trim().split('\n');
  const timeArray = timestamps.trim().split('\n').map(Number);
  const [currentCaption, setCurrentCaption] = useState('');
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    for (let i = 0; i < timeArray.length; i++) {
      const start = timeArray[i];
      const end = timeArray[i + 1] ?? Number.MAX_VALUE;
      if (currentTime >= start && currentTime < end) {
        setCurrentCaption(captionArray[i]);
        return;
      }
    }
    setCurrentCaption('');
  };

  return (
    <div className="mt-10 w-full">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#332600]">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onTimeUpdate={handleTimeUpdate}
          className="w-full aspect-video"
        />

        {/* Subtitle Overlay */}
        {currentCaption && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 
                          bg-[#ffbf00]/95 text-white text-xl px-8 py-4 
                          rounded-xl max-w-[90%] text-center z-10 pointer-events-none
                          whitespace-pre-wrap shadow-2xl backdrop-blur-sm
                          font-medium tracking-wide">
            {currentCaption}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
