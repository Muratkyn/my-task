import "./App.css";
import SubtitleTable from "./components/subtitleTable/SubtitleTable.tsx";
import VideoPlayer from "./components/videoPlayer/VideoPlayer.tsx";

function App() {
  return (
    <div>
      <main className="App">
        <h1>REVOICEIT VIDEO </h1>
        <div className="main-content__wrapper">
          <div className="content__row">
            <div className="content__wrapper">
              <h2>Subtitle Table</h2>
              <SubtitleTable />
            </div>
            <div className="content__wrapper">
              <h2>Video Player</h2>
              <VideoPlayer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
