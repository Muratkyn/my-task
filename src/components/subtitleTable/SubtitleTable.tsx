import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatTime, calculateDuration } from "../../utils/helpers";
import { subtitleTable } from "../../utils/constants";
import { RootState, SubtitleData } from "../../types/index";
import "./SubtitleTable.css";
import {
  deleteSubtitle,
  updateSubtitle,
  mergeSubtitles,
} from "../../store/subtitle";

const SubtitleTable = ({
  activeIndex,
  onSubtitleClick,
}: {
  activeIndex: number;
  onSubtitleClick: (startSeconds: number) => void;
}) => {
  const dispatch = useDispatch();
  const storedSubtitles = useSelector(
    (state: RootState) => state.subtitle.parsedSubtitles
  );
  const [localSubtitles, setLocalSubtitles] =
    useState<SubtitleData[]>(storedSubtitles);
  const [selectedSubtitles, setSelectedSubtitles] = useState<string[]>([]);

  useEffect(() => {
    setLocalSubtitles(storedSubtitles);
  }, [storedSubtitles]);

  const handleMergeSelected = () => {
    if (selectedSubtitles.length < 2) return;
    dispatch(
      mergeSubtitles({
        selectedIds: selectedSubtitles,
      })
    );

    setSelectedSubtitles([]);
  };

  const handleInputChange = (
    id: string,
    field: keyof SubtitleData,
    value: string
  ) => {
    const timeToSeconds = (time: string) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
    };

    const subtitle = storedSubtitles.find((sub) => sub.id === id);
    if (!subtitle) return;

    const currentStartTime = timeToSeconds(formatTime(subtitle.startTime));
    const currentEndTime = timeToSeconds(formatTime(subtitle.endTime));

    if (field === "startTime") {
      const newStartTime = timeToSeconds(value);
      if (newStartTime >= currentEndTime) return;

      if (newStartTime !== currentStartTime) {
        onSubtitleClick(newStartTime); ///why we need this function from the parent?
      }
    } else if (field === "endTime") {
      const newEndTime = timeToSeconds(value);
      if (newEndTime <= currentStartTime) return;
    }

    dispatch(updateSubtitle({ id, field, value }));
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedSubtitles((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleDeleteSelected = () => {
    selectedSubtitles.forEach((id) => {
      dispatch(deleteSubtitle({ id }));
    });
  };

  return (
    <div className="subtitle-table">
      {localSubtitles.length > 0 ? (
        <div className="subtitle-header">
          <button
            className="merge-button"
            onClick={handleMergeSelected}
            disabled={selectedSubtitles.length < 2}
          >
            Merge Lines
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedSubtitles.length === 0}
            className="delete-button"
          >
            Delete Lines
          </button>
        </div>
      ) : null}
      <div className="subtitle-header">
        {subtitleTable.map((title) => (
          <div key={title.id} className="subtitle-cell header-cell">
            {title.value}
          </div>
        ))}
        <br></br>
      </div>

      {localSubtitles.length === 0 ? (
        <div className="no-subtitles-message">
          The subtitles will be shown here..
        </div>
      ) : (
        localSubtitles.map((subtitle, index) => (
          <div
            key={subtitle.id}
            className={`subtitle-row ${
              activeIndex === index ? "highlight" : ""
            }`}
            onClick={() => onSubtitleClick(subtitle.startSeconds)}
          >
            <div className="subtitle-cell">
              <input
                type="checkbox"
                checked={selectedSubtitles.includes(subtitle.id)}
                onChange={() => handleCheckboxChange(subtitle.id)}
              />
            </div>
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
                value={calculateDuration(
                  formatTime(subtitle.startTime),
                  formatTime(subtitle.endTime)
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
