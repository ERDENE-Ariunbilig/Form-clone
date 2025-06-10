import './index.css';
import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';                // required\

import Navbar from './components/Navbar/Navbar';
import CreateForm from './pages/CreateForm/CreateForm';
import ViewResponses from './pages/ViewResponses/ViewResponses';
import Auth from './pages/auth/auth';
import FillForm from "./pages/fillForm/fillForm"
import Home from "./pages/home/home";

import { ScrollSmoother } from "gsap/ScrollSmoother";           // ari's thing
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


function App() {
    const [logged, setLogged] = useState(() => {
      return localStorage.getItem("logged") === "true";
    });
//////////////////////////////////////////////////////////
    useEffect(() => {
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true
    });
    }, []);
//////////////////////////////////////////////////////////
  return (
    <>
    <Navbar />
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <div className="app">
          <main>
            <Routes>
              <Route path="/" element={<Home logged={logged}/>} />
              <Route path="/create" element={<CreateForm logged={logged} />} />
              <Route path="/responses/:formId" element={<ViewResponses />} />
              <Route path="/auth" element={<Auth setLogged={setLogged} logged={logged} />} />
              <Route path="/fill/:formId" element={<FillForm/>} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;