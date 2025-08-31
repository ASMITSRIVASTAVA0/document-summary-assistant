import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);

  // ... existing code ...

// ... existing code ...

const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('summaryLength', summaryLength);

  setIsProcessing(true);
  try {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
    const response = await axios.post(`${apiBaseUrl}/api/documents/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setExtractedText(response.data.extractedText);
    setSummary(response.data.summary);
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error processing document. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};

// ... existing code ...

// ... existing code ...

  return (
    <div className="container">
      <h1>Document Summary Assistant</h1>
      
      <div className="upload-section">
        <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
        
        <div className="options">
          <label>Summary Length:</label>
          <select 
            value={summaryLength} 
            onChange={(e) => setSummaryLength(e.target.value)}
            disabled={isProcessing}
          >
            <option value="short">Short (1-2 sentences)</option>
            <option value="medium">Medium (paragraph)</option>
            <option value="long">Long (detailed summary)</option>
          </select>
        </div>
      </div>
      
      {isProcessing && <LoadingSpinner />}
      
      {summary && (
        <SummaryDisplay extractedText={extractedText} summary={summary} />
      )}
    </div>
  );
}

export default App;