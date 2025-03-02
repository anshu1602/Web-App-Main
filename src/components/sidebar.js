import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside id="sidebar" className="page-sidebar hidden-md hidden-sm hidden-xs">
      <div className="sidebar-inner">
        <div className="sidebar-scrollarea">
          <div className="sidebar-panel">
            <h5 className="sidebar-panel-title">Profile</h5>
          </div>

          <div className="user-info clearfix">
            <img src="img/avatars/128.jpg" alt="avatar" />
            <span className="name">SuggeElson</span>
            <div className="btn-group">
              <button type="button" className="btn btn-default btn-xs">
                <i className="l-basic-gear"></i>
              </button>
              <button
                type="button"
                className="btn btn-default btn-xs dropdown-toggle"
                data-toggle="dropdown"
              >
                settings <span className="caret"></span>
              </button>
              <ul className="dropdown-menu right" role="menu">
                <li>
                  <a href="profile.html">
                    <i className="fa fa-edit"></i>Edit profile
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-money"></i>Windraws
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-credit-card"></i>Deposits
                  </a>
                </li>
                <li className="divider"></li>
                <li>
                  <a href="login.html">
                    <i className="fa fa-power-off"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar-panel">
            <h5 className="sidebar-panel-title">Navigation</h5>
          </div>
          <div className="side-nav">
            <ul className="nav">
              <li>
                <Link to="/MainContent.js">
                  <i className="l-basic-laptop"></i>
                  <span className="txt">Intelligent test analysis </span>
                </Link>
              </li>
              <li>
                <Link to = "/TestPlanGeneration.js">
                  <i className="l-basic-webpage"></i>
                  <span className="txt">Automated test plan generation</span>
                  <span className="label">hot</span>
                </Link>
              </li>
              <li>
                <Link to="/RunTestPage">
                  <i className="l-ecommerce-graph1"></i>
                  <span className="txt">Run Test</span>
                </Link>
                <ul className="sub"></ul>
              </li>
              <li>
                <a href="#">
                  <i className="l-basic-webpage-txt"></i>
                  <span className="txt">Integrations</span>
                </a>
                <ul className="sub">
                  <li>
                    <a href="forms-basic.html">
                      <span className="txt">Jenkins</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="sidebar-panel">
            <h5 className="sidebar-panel-title">Server stats</h5>
            <div className="sidebar-panel-content">
              <div className="sidebar-stat mb10">
                <p className="color-white mb5 mt5">
                  <i className="fa fa-hdd-o mr5"></i> Disk Space{" "}
                  <span className="pull-right small">30%</span>
                </p>
                <div className="progress flat transparent progress-bar-xs">
                  <div
                    className="progress-bar progress-bar-white"
                    role="progressbar"
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "30%" }}
                  ></div>
                </div>
                <span className="dib s12 mt5 per100 text-right">3001.56 / 10000 MB</span>
              </div>
              <div className="sidebar-stat">
                <p className="color-white mb5 mt5">
                  <i className="glyphicon glyphicon-transfer mr5"></i> Bandwidth Transfer{" "}
                  <span className="pull-right small">78%</span>
                </p>
                <div className="progress flat transparent progress-bar-xs">
                  <div
                    className="progress-bar progress-bar-white"
                    role="progressbar"
                    aria-valuenow="78"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <span className="dib s12 mb10 mt5 per100 text-right">
                  87565.12 / 120000 MB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;