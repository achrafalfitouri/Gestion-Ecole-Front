import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Pages/Login";
import AppComponents from "./Components/AppComponents";







function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route par défaut pour tous les chemins */}
        <Route path="/*" element={<AppComponents />} />

        {/* Route pour la page de connexion */}
        <Route path="/login" element={<Login />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
