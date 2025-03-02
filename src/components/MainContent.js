import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function MainContent() {
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
      
      // Extract markdown content from JSON response
      let markdownContent;
      if (typeof response.data === 'string') {
        try {
          // Try to parse if it's a JSON string
          const parsed = JSON.parse(response.data);
          markdownContent = parsed.analysis || response.data;
        } catch {
          // If parsing fails, use the string directly
          markdownContent = response.data;
        }
      } else if (typeof response.data === 'object') {
        // If it's already an object, extract the analysis field
        markdownContent = response.data.analysis || JSON.stringify(response.data, null, 2);
      }

      setAnalysisResult(markdownContent);
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

    const blob = new Blob([analysisResult], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-results-${new Date().toISOString().split('T')[0]}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleEmail = async () => {
    if (!analysisResult) {
      alert('Please analyze a file first');
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/sendEmail', {
        analysis: analysisResult,
      });
  
      if (response.data.success) {
        alert('Email sent successfully!');
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    }
  };

  return (
    <div className="page-content sidebar-page right-sidebar-page clearfix">
      <div className="page-content-wrapper">
        <div className="page-content-inner">
          <div id="page-header" className="clearfix">
            <div className="page-header">
              <h2>Intelligent Test Analysis Results</h2>
              <span className="txt">Unlocking Insights, Enhancing Precision!</span>
            </div>
            <div className="header-stats">
              <div className="spark clearfix">
                <div className="spark-info">
                  <span className="number">2345</span>Visitors
                </div>
                <div id="spark-visitors" className="sparkline"></div>
              </div>
              <div className="spark clearfix">
                <div className="spark-info">
                  <span className="number">17345</span>Views
                </div>
                <div id="spark-templateviews" className="sparkline"></div>
              </div>
              <div className="spark clearfix">
                <div className="spark-info">
                  <span className="number">3700$</span>Sales
                </div>
                <div id="spark-sales" className="sparkline"></div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-12 sortable-layout">
              <div className="panel panel-default plain toggle panelMove panelClose panelRefresh">
                <div className="panel-heading">
                  <h4 className="panel-title">Analysis List</h4>
                </div>
                <div className="panel-body">
                  <div id="line-chart" style={{ width: "30%", height: "-25px" }}></div>
                  <div className="content-container">
                    <div className="history-panel">
                      <div className="history-item">
                        <strong>Login_Test_2025-02-13.jtl</strong>
                        <div>Analyzed: Feb 13, 2025</div>
                      </div>
                      <div className="history-item">
                        <strong>API_Load_2025-02-12.jtl</strong>
                        <div>Analyzed: Feb 12, 2025</div>
                      </div>
                      <div className="history-item">
                        <strong>Performance_Test_2025-02-11.jtl</strong>
                        <div>Analyzed: Feb 11, 2025</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-md-12 sortable-layout">
              <div className="panel panel-default plain toggle panelMove panelClose panelRefresh">
                <div className="panel-heading">
                  <h4 className="panel-title">Files Upload</h4>
                </div>
                <div className="panel-body">
                  <div id="line-chart-dots" style={{ height: "25px", width: "100%" }}></div>
                  <div className="file-analyze-section">
                    <input type="file" id="jtl-file-input" accept=".jtl" onChange={handleFileChange} />
                    <div className="button-group">
                      <button className="analyze-button" onClick={handleAnalyze} disabled={analyzing}>
                        {analyzing ? "Analyzing..." : "Analyze"}
                      </button>
                      <button className="download-button" onClick={handleDownload}>
                        Download
                      </button>
                      <button className="email-button" onClick={handleEmail}>
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel panel-default plain toggle panelMove panelClose panelRefresh">
                <div className="panel-heading">
                  <h4 className="panel-title">Analysis Results</h4>
                </div>
                <div className="panel-body">
                  <div id="auto-update-chart" style={{ width: "100%", height: "0px" }}></div>
                  <div className="results-panel">
                    {analysisResult ? (
                      <div className="markdown-content">
                        <ReactMarkdown>{analysisResult}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>No analysis results yet. Please analyze a file.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;