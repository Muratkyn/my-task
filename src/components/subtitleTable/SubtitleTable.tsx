import { useDispatch, useSelector } from "react-redux";

import { updateSubtitle } from "../../store/subtitle/index";
import { formatTime, calculateDuration } from "../../helpers";

import { subtitleTable } from "../../constants/index";
import { RootState, SubtitleData } from "../../types/index";
import "./SubtitleTable.css";

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
