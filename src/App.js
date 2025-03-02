"use client"
import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header"
import Sidebar from "./components/sidebar"
import MainContent from "./components/MainContent"
import Footer from "./components/Footer"
import "./App.css"
import TestPlanGeneration from "./pages/TestPlanGeneration"
import RunTestPage from "./pages/RunTestPage"; 

function App() {
  return (
    <Router>
    <Header />
    <div id="wrapper">
      <Sidebar />
      <div style={{ padding: "20px" }}> {/* Ensures content isn’t hidden */}
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/MainContent.js" element={<MainContent/>} />
            <Route path="/TestPlanGeneration.js" element={<TestPlanGeneration />} />
            <Route path="/RunTestPage" element={<RunTestPage />} />
          </Routes>
        </div>
    </div>
    <Footer />
  </Router>
  )
}

export default App