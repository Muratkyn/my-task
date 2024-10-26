import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";

import { setSubtitle } from "../../store/subtitle/index";
import { RootState } from "../../types";

import "./VideoPlayer.css";

const VideoPlayer = () => {
  const [videoFilePath, setVideoFilePath] = useState<null | string>(null);
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const uploadedSubtitles = useSelector(
    (state: RootState) => state.subtitle.parsedSubtitles
  );

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = (event.target as HTMLInputElement).files![0];
    if (targetFile) {
      const url = URL.createObjectURL(targetFile);
      setVideoFilePath(url);
    }
  };
  const handleSubtitleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = (event.target as HTMLInputElement).files![0];
    if (targetFile && targetFile.name.endsWith(".srt")) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const fileContent = event.target?.result;
        dispatch(setSubtitle(fileContent));
      };
      fileReader.readAsText(targetFile);
    }
  };

  return (
    <div className="videoPlayer-table">
      {videoFilePath ? (
        <>
          <div style={{ position: "relative" }}>
            <ReactPlayer
              className="video-player"
              url={videoFilePath}
              width="100%"
              height="100%"
              controls
            />
          </div>
        </>
      ) : (
        <div className="button-section">
          <label className="upload-button">
            Upload Video
            <input
              type="file"
              accept="video"
              onChange={handleVideoUpload}
              style={{ display: "none" }}
            />
          </label>
          <label className="upload-button">
            Upload Subtitle
            <input
              type="file"
              accept=".srt"
              onChange={handleSubtitleUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
