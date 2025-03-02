import React, { useState } from 'react';
import axios from 'axios';

function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.jtl')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid JTL file');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyzeJTL', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error analyzing file:', error);
      alert('Error analyzing file. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!analysisResult) {
      alert('Please analyze a file first');
      return;
    }
    const blob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="analyze-container">
      <h1>Intelligent Test Analysis Results</h1>
      
      <div className="file-analyze-section">
        <input
          type="file"
          id="jtl-file-input"
          accept=".jtl"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {selectedFile && (
          <span className="filename">{selectedFile.name}</span>
        )}
        <div className="button-group">
          <button 
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>
          <button 
            className="analyze-button"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>

      <div className="content-container">
        <div className="history-panel">
          <h2>Analysis History</h2>
          <div className="history-item">
            <strong>Login_Test_2025-02-13.jtl</strong>
            <div>Analyzed: Feb 13, 2025 10:30 AM</div>
          </div>
          <div className="history-item">
            <strong>API_Load_2025-02-12.jtl</strong>
            <div>Analyzed: Feb 12, 2025 3:45 PM</div>
          </div>
          <div className="history-item">
            <strong>Performance_Test_2025-02-11.jtl</strong>
            <div>Analyzed: Feb 11, 2025 2:15 PM</div>
          </div>
        </div>

        <div className="results-panel">
          <h2>Analysis Results</h2>
          <pre>{analysisResult ? JSON.stringify(analysisResult, null, 2) : ''}</pre>
        </div>
      </div>
    </div>
  );
}

export default AnalyzePage;