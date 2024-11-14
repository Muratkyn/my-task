import "./App.css";
import { useState } from "react";
import SubtitleTable from "./components/subtitleTable/SubtitleTable";
import VideoPlayer from "./components/videoPlayer/VideoPlayer";

function App() {
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleSubtitleClick = (startSeconds: number) => {
    console.log(startSeconds, "start");
    setSearchTime(startSeconds);
  };

  const handleActiveSubtitleChange = (index: number | null) => {
    if (index !== null) {
      console.log("index", index);
      setActiveIndex(index);
    }
  };

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
              <VideoPlayer
                searchTime={searchTime}
                onActiveSubtitleChange={handleActiveSubtitleChange}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
