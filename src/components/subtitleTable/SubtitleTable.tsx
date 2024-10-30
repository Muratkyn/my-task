import { useDispatch, useSelector } from "react-redux";
import { updateSubtitle } from "../../store/subtitle/index";
import { formatTime, calculateDuration } from "../../utils/helpers";
import { subtitleTable } from "../../utils/constants";
import { RootState, SubtitleData } from "../../types/index";
import "./SubtitleTable.css";

const SubtitleTable = ({
  activeIndex,
  onSubtitleClick,
}: {
  activeIndex: number;
  onSubtitleClick: (startSeconds: number) => void;
}) => {
  const subtitles = useSelector(
    (state: RootState) => state.subtitle.parsedSubtitles
  );
  const dispatch = useDispatch();
  const handleInputChange = (
    id: string,
    field: keyof SubtitleData,
    value: string
  ) => {
    const timeToSeconds = (time: string) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
    };

    const subtitle = subtitles.find((sub) => sub.id === id);
    if (!subtitle) return;

    const currentStartTime = timeToSeconds(formatTime(subtitle.startTime));
    const currentEndTime = timeToSeconds(formatTime(subtitle.endTime));

    if (field === "startTime") {
      const newStartTime = timeToSeconds(value);
      if (newStartTime !== currentStartTime) {
        onSubtitleClick(newStartTime);
      }
      if (newStartTime > currentEndTime) return;
    } else if (field === "endTime") {
      const newEndTime = timeToSeconds(value);
      if (newEndTime <= currentStartTime) return;
    }

    dispatch(updateSubtitle({ id, field, value }));
  };

  return (
    <div className="subtitle-table">
      <div className="subtitle-header">
        {subtitleTable.map((title: any) => (
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
          <div
            key={subtitle.id}
            className={`subtitle-row ${
              activeIndex === index ? "highlight" : ""
            }`}
            onClick={() => onSubtitleClick(subtitle.startSeconds)}
          >
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
