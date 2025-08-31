import React from 'react';

const SummaryDisplay = ({ extractedText, summary }) => {
  return (
    <div className="results">
      <h2>Summary</h2>
      <div className="summary">{summary}</div>
      
      <h2>Extracted Text</h2>
      <div className="extracted-text">{extractedText}</div>
    </div>
  );
};

export default SummaryDisplay;