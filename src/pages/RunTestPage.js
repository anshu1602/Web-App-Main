
import React, { useState } from "react";

const RunTestPage = () => {
  const [resultFile, setResultFile] = useState(null); // Store result filename
  const [jtlContent, setJtlContent] = useState(""); // Store .jtl file content
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [history, setHistory] = useState([]); // Store history of generated files

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("testFile");
    const statusDiv = document.getElementById("status");

    if (fileInput.files.length === 0) {
      statusDiv.innerText = "Please select a .jmx file before submitting.";
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    statusDiv.innerText = "Running test...";
    setResultFile(null);
    setJtlContent("");

    fetch(`http://localhost:5000/run-test/${encodeURIComponent(file.name)}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend response:", data);
        if (data.status === "success") {
          statusDiv.innerText = `✅ ${data.message}`;
          setResultFile(data.result_file);
          setJtlContent(data.jtl_content);

          // Add to history
          const now = new Date().toLocaleString();
          setHistory((prevHistory) => [
            { filename: data.result_file, date: now },
            ...prevHistory,
          ]);
        } else {
          statusDiv.innerText = `❌ Error: ${data.message}`;
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        statusDiv.innerText = `❌ Network Error: ${error.message}`;
      })
      .finally(() => setIsLoading(false));
  };

  const handleDownload = () => {
    if (resultFile) {
      window.location.href = `http://localhost:5000/download/${resultFile}`;
    }
  };

  return (
    <div className="page-content sidebar-page right-sidebar-page clearfix">
      <div className="page-content-wrapper">
        <div className="page-content-inner">
          {/* Page Header */}
          <div id="page-header" className="clearfix">
            <div className="page-header">
              <h2>Run JMeter Test</h2>
              <span className="txt">Execute Your Performance Tests Seamlessly!</span>
            </div>
            <div className="header-stats">
              <div className="spark clearfix">
                <div className="spark-info">
                  <span className="number">15</span>Tests Run Today
                </div>
                <div id="spark-tests" className="sparkline"></div>
              </div>
              <div className="spark clearfix">
                <div className="spark-info">
                  <span className="number">87%</span>Success Rate
                </div>
                <div id="spark-success" className="sparkline"></div>
              </div>
            </div>
          </div>

          {/* Main Content with History */}
          <div className="row">
            {/* History Panel (Left Side) */}
            <div className="col-lg-3 col-md-12 sortable-layout">
              <div className="panel panel-default plain toggle panelMove panelClose panelRefresh">
                <div className="panel-heading">
                  <h4 className="panel-title">History</h4>
                </div>
                <div className="panel-body">
                  <div className="history-panel">
                    {history.length > 0 ? (
                      history.map((item, index) => (
                        <div className="history-item" key={index}>
                          <strong>{item.filename}</strong>
                          <div>Ran: {item.date}</div>
                        </div>
                      ))
                    ) : (
                      <p>No tests run yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Run Test Panel (Right Side) */}
            <div className="col-lg-9 col-md-12 sortable-layout">
              <div className="panel panel-default plain toggle panelMove panelClose panelRefresh">
                <div className="panel-heading">
                  <h4 className="panel-title">Run Test</h4>
                </div>
                <div className="panel-body">
                  <form id="runTestForm" onSubmit={handleSubmit}>
                    <label htmlFor="testFile">Select .jmx Test Plan:</label>
                    <input
                      type="file"
                      id="testFile"
                      name="testFile"
                      accept=".jmx"
                      required
                      style={{ margin: "10px 0" }}
                    />
                    <button
                      type="submit"
                      className="analyze-button"
                      disabled={isLoading}
                    >
                      {isLoading ? "Running..." : "Run Test"}
                    </button>
                  </form>
                  <div id="status" style={{ marginTop: "20px" }}></div>

                  {/* Download Button */}
                  {resultFile && (
                    <div style={{ marginTop: "20px" }}>
                      <button
                        onClick={handleDownload}
                        className="download-button"
                      >
                        Download Result (.jtl)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* JTL File Content Section */}
              {jtlContent && (
                <div className="panel panel-default plain toggle panelMove panelClose panelRefresh">
                  <div className="panel-heading">
                    <h4 className="panel-title">JTL File Content</h4>
                  </div>
                  <div className="panel-body">
                    <div className="results-panel">
                      <pre className="jtl-content">{jtlContent}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunTestPage;
