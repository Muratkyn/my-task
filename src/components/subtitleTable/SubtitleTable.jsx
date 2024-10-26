import React from "react";
import "./SubtitleTable.css";
import { subtitleTable } from "../../constants/index.ts";

const SubtitleTable = () => {
  return (
    <div className="subtitle-table">
      <div className="subtitle-header">
        {subtitleTable.map((title) => (
          <div key={title.id} className="subtitle-cell">
            {title.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtitleTable;
