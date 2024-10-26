import React from "react";
import "./SubtitleTable.css";
import { subtitleTable } from "../../constants/index";
import { useDispatch, useSelector } from "react-redux";
import { updateSubtitle } from "../../store/subtitle/index";
import { RootState, SubtitleData } from "../../types/index";

const SubtitleTable = () => {
  const subtitles = useSelector(
    (state: RootState) => state.subtitle.parsedSubtitles
  );
  const dispatch = useDispatch();

  const handleInputChange = (
    id: string,
    field: keyof SubtitleData,
    value: string
  ) => {
    dispatch(updateSubtitle({ id, field, value }));
  };

  const formatTime = (time: string) => time.split(",")[0];

  const formatDurationTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="subtitle-table">
      <div className="subtitle-header">
        {subtitleTable.map((title) => (
          <div key={title.id} className="subtitle-cell header-cell">
            {title.value}
          </div>
        ))}
      </div>
      {subtitles.length === 0 ? (
        <div className="no-subtitles-message">
          The subtitles will be shown here..
        </div>
      ) : (
        subtitles.map((subtitle, index) => (
          <div key={subtitle.id} className="subtitle-row">
            <div className="subtitle-cell">{index + 1}</div>
            <div className="subtitle-cell">
              <input
                className="subtitle-input"
                value={formatTime(subtitle.startTime)}
                onChange={(e) =>
                  handleInputChange(subtitle.id, "startTime", e.target.value)
                }
              />
            </div>
            <div className="subtitle-cell">
              <input
                className="subtitle-input"
                value={formatTime(subtitle.endTime)}
                onChange={(e) =>
                  handleInputChange(subtitle.id, "endTime", e.target.value)
                }
              />
            </div>
            <div className="subtitle-cell">
              <input
                className="subtitle-input"
                value={formatDurationTime(
                  subtitle.endSeconds - subtitle.startSeconds
                )}
                readOnly
              />
            </div>
            <div className="subtitle-cell text">
              <input
                className="subtitle-input"
                value={subtitle.text}
                onChange={(e) =>
                  handleInputChange(subtitle.id, "text", e.target.value)
                }
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SubtitleTable;
