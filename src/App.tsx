import "./App.css";
import { useState, useEffect, useRef } from "react";
import SubtitleTable from "./components/subtitleTable/SubtitleTable";
import VideoPlayer from "./components/videoPlayer/VideoPlayer";
import ReactPlayer from "react-player";

function App() {
  const [searchTime, setSearchTime] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const videoPlayerRef = useRef<ReactPlayer | null>(null);

  const handleSubtitleClick = (startSeconds: number) => {
    setSearchTime(startSeconds);
  };

  useEffect(() => {
    if (searchTime !== null && videoPlayerRef.current) {
      console.log("Searching for.......", searchTime);
      videoPlayerRef.current.seekTo(searchTime);
    }
  }, [searchTime]);

  return (
    <div>
      <main className="App">
        <h1>REVOICEIT VIDEO</h1>
        <div className="main-content__wrapper">
          <div className="content__row">
            <div className="content__wrapper">
              <h2>Subtitle Table</h2>
              <SubtitleTable
                onSubtitleClick={handleSubtitleClick}
                activeIndex={activeIndex}
              />
            </div>
            <div className="content__wrapper">
              <h2>Video Player</h2>
              <VideoPlayer searchTime={searchTime} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;