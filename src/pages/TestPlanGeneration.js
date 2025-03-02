import React from "react";

const TestPlanGeneration = () => {
  return (
    <div className="page-content sidebar-page right-sidebar-page clearfix">
          <div className="page-content-wrapper">
            <div className="page-content-inner">
              <div id="page-header" className="clearfix">
                <div className="page-header">
                  <h2>Automated Test Plan Generator</h2>
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
                      <h4 className="panel-title">History</h4>
                    </div>
                   
                    <input  type="text" class="history-search" placeholder="Search tests..."></input>
                      <select className="history-filter">
                        <option>All Types</option>
                        <option>Load Tests</option>
                        <option>Performance Tests</option>
                        <option>Stress Tests</option>
                      </select>
                    
                  
                    <div className="panel-body">
                      <div id="line-chart" style={{ width: "30%", height: "-25px" }}></div>
                      <div className="content-container">
                        <div className="history-panel">
                          <div className="history-item">
                            <strong>Login Performance Test</strong>
                            <span>Created: Today</span>
                            <div>Load Test</div>
                          </div>
                          <div className="history-item">
                            <strong>API Load Test</strong>
                            <span>Created: Yesterday</span>
                            <div>API</div>
                          </div>
                          <div className="history-item">
                            <strong>E- Commerce Checkout</strong>
                            <span>Created: Yesterday</span>
                            <div>Web</div>
                          </div>
                          <div className="history-item">
                            <strong>Database Load Test</strong>
                            <span>Created: Yesterday</span>
                            <div>Database</div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                <div className="col-lg-8 col-md-12 sortable-layout">   
                  <div className="panel panel-default plain toggle panelMove panelClose panelRefresh">
                    <div className="panel-heading">
                      <h4 className="panel-title">JMeter Test Generator</h4>
                    </div>
                      
                          <button class="download-jmx">Download</button>
                
                    <div className="panel-body">
                      <div id="auto-update-chart" style={{ width: "100%", height: "0px" }}></div>
                      <div class="chat-container">
                        <div class="message bot-message">
                            Hello! I can help you create a JMeter test plan. What kind of test would you like to create?
                        </div>
                        <div class="message user-message">
                            I want to create a load test for login API
                        </div>
                        <div class="message bot-message">
                            I'll help you create a login API load test. Please provide the following details:
                            1. API endpoint URL
                            2. Number of users to simulate
                            3. Ramp-up period
                            4. Test duration
                        </div>
                      </div>
                          <input type="text" class ="text-box" placeholder="Type your message here..."/>
                          <button className="send">Send</button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default TestPlanGeneration
