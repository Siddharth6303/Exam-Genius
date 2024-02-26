import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Questionform from "./components/Questionform";
import Question_paper_generation from "./components/Question_paper_generation";

function App() {
  return (
<div className="App ">
     
     <BrowserRouter>
       <Routes>
         <Route path="/" element={<Question_paper_generation />} />
         <Route path="/input" element={<Questionform/>} />
       </Routes>
     </BrowserRouter>
     </div>
  );
}

export default App;
