import {  Route, Routes } from "react-router-dom";



import Vital from "../../Pages/Vital";
import Cookies from 'js-cookie';
import Unauthorized from "../../Pages/Unauthorized";
import { AnimatePresence } from 'framer-motion';
import axios from "axios";
import React, { lazy } from "react";
import { fetchUserData } from "../interceptors/axios"; // Import fetchUserData from axios.js
import DashboardDataProvider from '../../Pages/Dashbaord/DashboardProvider';


import { useEffect,useState } from "react";

// Lazy-loaded components
const Dashboard = lazy(() => import("../../Pages/Dashbaord"));
const RendezVous = lazy(() => import("../../Pages/RendezVous"));
const Ordonance = lazy(() => import("../../Pages/Ordonance"));
const DossiersMedicaux = lazy(() => import("../../Pages/DossiersMedicaux"));
const Patient = lazy(() => import("../../Pages/Patient"));
const Utilisateur = lazy(() => import("../../Pages/Utilisateur"));
const Pharmacie = lazy(() => import("../../Pages/Pharmacie"));
const Examen = lazy(() => import("../../Pages/Examen"));

function AppRoutes() {

  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData = JSON.parse(localStorage.getItem("userData")); // Check if user data exists in local storage
        if (!userData) {
          userData = await fetchUserData(); // Fetch user data if not available in local storage
          localStorage.setItem("userData", JSON.stringify(userData)); // Store user data in local storage
        }
        
        setUserRoles(userData.specialite);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error if necessary
      }
    };

    fetchData();
  }, []);
// Render the Utilisateur component only when userRoles are loaded


 


  return (
    <AnimatePresence>
     
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<DashboardDataProvider>{(data) => <Dashboard data={data} />}</DashboardDataProvider>} />

        {/* Patient */}
       
            <Route path="/patient" element={<Patient />} />
         
         
       

        {/* Utilisateur */}
        {(userRoles.includes("Admin")) && (
          <>
            <Route path="/utilisateur" element={<Utilisateur />} />
            
          </>
        )}

        {/* Rendez-vous */}
       
          
            <Route path="/rendezvous" element={<RendezVous />} />
           
          
       

        {/* Pharmacie */}
        {(userRoles.includes("Admin") || userRoles.includes("Medecin")) && (
          <>
            <Route path="/pharmacie" element={<Pharmacie />} />
          
          </>
        )}

        {/* Examen */}
        {(userRoles.includes("Admin") || userRoles.includes("Medecin")) && (
          <>
            <Route path="/examen" element={<Examen />} />
          
          </>
        )}

        {/* Ordonance */}
        {(userRoles.includes("Admin") || userRoles.includes("Medecin")) && (
          <>
            <Route path="/ordonance" element={<Ordonance />} />
        
          </>
        )}

        {/* Dossier-Medicaux */}
        {(userRoles.includes("Admin") || userRoles.includes("Medecin")) && (
          <>
            <Route path="/dossiersmedicaux" element={<DossiersMedicaux />} />
          
          </>
        )}

        {/* Vital */}
        {(userRoles.includes("Admin") || userRoles.includes("Medecin")) && (
          <>
            <Route path="/vital" element={<Vital />} />
          </>
        )}
       
        {/* Fallback route for unauthorized access */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </AnimatePresence>
  );
}
export default AppRoutes;