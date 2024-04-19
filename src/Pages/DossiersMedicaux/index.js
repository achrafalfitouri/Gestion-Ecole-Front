import { Space, Table, Typography, Popconfirm, Button, Input, } from "antd";
import { useEffect, useState } from "react";
import * as React from 'react';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import axios from "axios";

import { lazy } from "react";








const AfficherDossier = lazy(() => import("./AfficherDossier"));


function DossiersMedicaux() {
  const [showTable, setShowTable] = useState(true);
  const [, setShowAjouterForm] = useState(false);
  const [, setShowModifierForm] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');



  const [showAfficherForm, setShowAfficherForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAfficherClick = (id) => {
    const selectedPatient = dataSource.find((patient) => patient.id === id);
    setSelectedPatient(selectedPatient);
    setShowTable(false);
    setShowAfficherForm(true);
  
    axios
      .get(`/api/ordonances?page=1&itemsPerPage=30&patient.id=${selectedPatient.id}`)
      .then((response) => {
        const userData = response.data['hydra:member'][0];
  
        setSelectedUser(userData);
  
        const patientId = userData.patient.split("/").pop();
        const prefixedPatientId = `DM-${patientId}`;
  
        setInitialFormValues({
        
          patient: prefixedPatientId,
          nomPatient: userData.nomPatient,
          nomMedicament: userData.nomMedicament,
          description: userData.description,
          maladie: userData.maladie,
          cin: selectedPatient.cin
        });
  
        setShowAfficherForm(true);
        setShowModifierForm(false);
        setShowAjouterForm(false);
        setShowTable(false);
  
  
        fetchExamenTests(); 
        fetchExamenResultats(); 
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };
  

  useEffect(() => {
    const fetchPatients = () => {
      const params = {
        page: currentPage,
        itemsPerPage: pageSize,
        cin: searchText,
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/patients?pagination=true", { params })
        .then((response) => {
          setDataSource(response.data['hydra:member']);





          
          setTotalItems(response.data['hydra:totalItems']);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data from API:", error);
          setLoading(false);
        });
    };
  
    setLoading(true);
    fetchPatients();
  }, [currentPage, pageSize, searchText]);
  

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (value) => {
    setCurrentPage(1);
    setSearchText(value);
  };


  const columns = [
    { title: "CIN", dataIndex: "cin", key: "cin", width: '30%' },
    { title: "nom", dataIndex: "nom", key: "nom", width: '30%' },
    { title: "age", dataIndex: "age", key: "age", width: '30%' },
    { title: "Email", dataIndex: "email", key: "email", width: '30%' },
    { title: "Tel", dataIndex: "tel", key: "tel", width: '30%' },
    { title: "Adresse", dataIndex: "adresse", key: "adresse", width: '30%' },
    {
      title: "Action",
      fixed: 'right',
      width: '200',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" onClick={() => handleAfficherClick(record.id)}>
            Afficher dossier
          </Button>
          <Popconfirm title="Sure to delete?">
            <Button danger>Supprimer</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchExamenTests = () => {
    const params = {
   

      'order[created_at]': 'DESC'
    };

    axios
      .get(`/api/examentests?pagination=true&patient.id=${selectedPatient.id}`,{params})
      .then((response) => {

        const testData = response.data['hydra:member'][0];
        setSelectedExamenTests(testData)
        

        setInitialFormValues({
         
          nomPatient: testData.nomPatient,
          nomTest: testData.nomTest,
          description: testData.description,
          maladie: testData.maladie,
         
         
        });

      })
      .catch((error) => {
        console.error('Error fetching examen tests data:', error);
      });
  };

  const fetchExamenResultats = () => {
    const params = {
   

      'order[created_at]': 'DESC'
    };
    axios
      .get(`/api/examenresultats?pagination=true&patient.id=${selectedPatient.id}`,{params})
      .then((response) => {
        const resultatData = response.data['hydra:member'][0];
        setSelectedExamenResultats(resultatData)
       

        setInitialFormValues({
         
          nomPatient: resultatData.nomPatient,
          nomTest: resultatData.nomTest,
          maladie: resultatData.maladie,
          description: resultatData.description,
         
         
        });

      })
      .catch((error) => {
        console.error('Error fetching examen resultats data:', error);
      });
  };
  const fetchVitals = () => {
    const params = {
   

      'order[created_at]': 'DESC'
    };
    axios
      .get(`/api/vitals?pagination=true&patient.id=${selectedPatient.id}`,{params})
      .then((response) => {
        const vitalData = response.data['hydra:member'][0];
        setSelectedVitals(vitalData)
        const patientId = vitalData.patient.split("/").pop();
        const prefixedPatientId = `DM-${patientId}`;
        const suffixPoids= `${vitalData.poids} kg`
        const suffixTaille= `${vitalData.taille} cm`
        const suffixTension= `${vitalData.tensionArtetielle} mmHg`
        const suffixFrequence= `${vitalData.frequenceCardiaque} bpm`
        setInitialFormValues({
         
          patient: prefixedPatientId,
          poids : suffixPoids,
          assurance: vitalData.assurance,
          allergies: vitalData.allergies,
          taille: suffixTaille,
          antecedentsMedicaux: vitalData.antecedentsMedicaux,
          medicamentActuel: vitalData.medicamentActuel,
          nemuroAssurance: vitalData.nemuroAssurance,
          groupeSanguin: vitalData.groupeSanguin,
          tensionArtetielle: suffixTension,
          frequenceCardiaque: suffixFrequence,
          antecedentsFamiliaux: vitalData.antecedentsFamiliaux,
          nomPatient: vitalData.nomPatient,
          
        
         
        });

      })
      .catch((error) => {
        console.error('Error fetching examen resultats data:', error);
      });
  };

  useEffect(() => {
    if (selectedPatient) {
      fetchExamenTests();
      fetchExamenResultats();
      fetchVitals();
    }
  }, );
  const [selectedExamenResultats, setSelectedExamenResultats] = useState([]);
  const [selectedExamenTests, setSelectedExamenTests] = useState([]);
  const [selectedVitals, setSelectedVitals] = useState([]);


 


  return (
    <motion.div
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Row>
        <Col xs={{ span: 1, offset: -1 }}>
          {showTable && (
            <Space size={20} direction="vertical">
              <Typography.Title level={4}>Dossiers medicaux</Typography.Title>

              <Input.Search
                style={{ width: '200px' }}
                placeholder="Rechercher par cin"
                onSearch={handleSearch}
                enterButton
              />
              <Table
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                }}
                onChange={handleTableChange}
              ></Table>
            </Space>
          )}
        </Col>
      </Row>
      {showAfficherForm && selectedPatient && (
        <AfficherDossier
          patient={selectedPatient}
          initialValues={initialFormValues}
          user={selectedUser}
          examenTests={selectedExamenTests}
          examenResultats={selectedExamenResultats}
          vitals={selectedVitals}
        />
      )}
    </motion.div>
  );
}

export default DossiersMedicaux;
