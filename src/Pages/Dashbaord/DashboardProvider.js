import { useState, useEffect } from 'react';
import axios from 'axios';

// Higher-level component to handle data fetching
function DashboardDataProvider({ children }) {
  const [dashboardData, setDashboardData] = useState({
    patientCount: 0,
    ordonanceCount: 0,
    rendezvousCount: 0,
    examentestCount: 0,
    examenresultatCount: 0,
    patientCountToday : 0

  });

 


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsResponse, ordonancesResponse, rendezvousResponse, examentestsResponse, examenresultatsResponse] = await Promise.all([
          axios.get('/api/patients'),
          axios.get('/api/ordonances'),
          axios.get('/api/rendezvouses'),
          axios.get('/api/examentests'),
          axios.get('/api/examenresultats')
        ]);

         const patients = patientsResponse.data['hydra:member'];
    const today = new Date().toISOString().split('T')[0];
    const patientCountToday = patients.filter(patient => patient.createdAt.split('T')[0] === today).length; // Corrected filter condition
        const patientCount = patientsResponse.data['hydra:member'].length;
        const ordonanceCount = ordonancesResponse.data['hydra:member'].length;
        const rendezvousCount = rendezvousResponse.data['hydra:member'].length;
        const examentestCount = examentestsResponse.data['hydra:member'].length;
        const examenresultatCount = examenresultatsResponse.data['hydra:member'].length;

        setDashboardData({
          patientCount,
          ordonanceCount,
          rendezvousCount,
          examentestCount,
          examenresultatCount,
          patientCountToday,
         
        });
       
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    fetchData();
  }, []);

  return children(dashboardData);
}

export default DashboardDataProvider;
