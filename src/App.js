import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./pages/Login"
import HomePage from "./pages/HomePage"
import Registration from "./pages/Registration";

function App() {
  return (
    <>
   <div className="body">
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registration />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/home" element={<HomePage />}/>
      </Routes>
    </BrowserRouter>
   </div>
    </>
  );
}

export default App;
