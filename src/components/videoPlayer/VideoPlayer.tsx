import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import WaveSurfer from "wavesurfer.js";

import { setSubtitle } from "../../store/subtitle/index";
import { RootState, VideoPlayerProps } from "../../types";
import "./VideoPlayer.css";

const VideoPlayer = forwardRef(
  ({ searchTime, onActiveSubtitleChange }: VideoPlayerProps) => {
    const [videoFilePath, setVideoFilePath] = useState<string | null>(null);
    const [currentSubtitle, setCurrentSubtitle] = useState("");
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const waveFormRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<ReactPlayer | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<
      number | null
    >(null);
    const [playedSeconds, setPlayedSeconds] = useState<number>(0);

    const dispatch = useDispatch();
    const uploadedSubtitles = useSelector(
      (state: RootState) => state.subtitle.parsedSubtitles
    );

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const targetFile = event.target.files?.[0];
      if (targetFile) {
        const url = URL.createObjectURL(targetFile);
        setVideoFilePath(url);
      }
    };

    const handleSubtitleUpload = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const targetFile = event.target.files?.[0];
      if (targetFile && targetFile.name.endsWith(".srt")) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const fileContent = e.target?.result;
          dispatch(setSubtitle(fileContent));
        };
        fileReader.readAsText(targetFile);
      }
    };

    const handleReactPlayerProgress = ({
      playedSeconds,
    }: {
      playedSeconds: number;
    }) => {
      setPlayedSeconds(playedSeconds); // Update playedSeconds for WaveSurfer sync

      const currentSub = uploadedSubtitles.find((sub, index) => {
        const isActive =
          playedSeconds >= sub.startSeconds && playedSeconds <= sub.endSeconds;
        if (isActive) {
          setActiveSubtitleIndex(index); // Update the active subtitle index
          onActiveSubtitleChange(index); // Pass the active index to the parent
        }
        return isActive;
      });

      setCurrentSubtitle(currentSub ? currentSub.text : "");
    };

    const handleWaveSurferProgress = (event: React.MouseEvent) => {
      const { offsetX } = event.nativeEvent;
      console.log(offsetX, "offSet....");
      const duration = waveSurferRef.current?.getDuration();
      if (duration && waveFormRef.current) {
        const newTime = (offsetX / waveFormRef.current.offsetWidth) * duration;
        console.log(newTime, "newTime....");
        playerRef.current?.seekTo(newTime);
        waveSurferRef.current!.seekTo(newTime / duration);
      }
    };

    useEffect(() => {
      if (searchTime != null) {
        playerRef.current?.seekTo(searchTime);
      }
    }, [searchTime]);

    useEffect(() => {
      if (uploadedSubtitles && uploadedSubtitles.length > 0) {
        const currentTime = playerRef.current?.getCurrentTime();
        const currentSubtitle = uploadedSubtitles.find(
          (sub) =>
            currentTime! >= sub.startSeconds && currentTime! <= sub.endSeconds
        );
        setCurrentSubtitle(currentSubtitle ? currentSubtitle.text : "");
      }
    }, [uploadedSubtitles, searchTime]);

    useEffect(() => {
      if (videoFilePath && waveFormRef.current) {
        waveSurferRef.current = WaveSurfer.create({
          container: waveFormRef.current,
          waveColor: "#0693e3",
          progressColor: "#333",
          cursorColor: "#ff6347",
          barWidth: 2,
          height: 100,
        });

        waveSurferRef.current.on("play", () =>
          playerRef.current?.getInternalPlayer()?.play()
        );
        waveSurferRef.current.on("pause", () =>
          playerRef.current?.getInternalPlayer()?.pause()
        );

        waveSurferRef.current.load(videoFilePath);
        waveSurferRef.current.setMuted(true);
      }

      return () => {
        waveSurferRef.current?.destroy();
      };
    }, [videoFilePath]);

    //sync waveform based on playingseconds..
    useEffect(() => {
      const duration = playerRef.current?.getDuration();
      if (duration && duration > 0) {
        waveSurferRef.current!.seekTo(playedSeconds / duration);
      } else {
        console.warn("Invalid video duration, Please add a video");
      }
    }, [playedSeconds]);

    return (
      <div className="videoPlayer-table">
        {videoFilePath ? (
          <>
            <div style={{ position: "relative" }}>
              <ReactPlayer
                ref={playerRef}
                className="video-player"
                url={videoFilePath}
                onProgress={handleReactPlayerProgress}
                width="100%"
                height="90%"
                controls
              />
              {currentSubtitle && (
                <div className="subtitle-overlay">{currentSubtitle}</div>
              )}
            </div>
            <div
              ref={waveFormRef}
              className="waveform"
              onClick={handleWaveSurferProgress}
            />
            {uploadedSubtitles.length > 0 ? (
              <p className="subtitle-uploaded">Subtitle file uploaded!</p>
            ) : (
              <p className="subtitle-tobe__uploaded">
                Please upload a subtitle file to continue the video.
              </p>
            )}
          </>
        ) : (
          <p>Upload a video to get started!</p>
        )}
        <div className="button-section">
          <label className="upload-button">
            Upload Video
            <input
              type="file"
              accept="video/*"
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
      </div>
    );
  }
);

export default VideoPlayer;
