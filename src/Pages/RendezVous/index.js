import {  Space, Table, Typography, Popconfirm, Button, Input } from "antd";
import { useEffect, useState } from "react";
import * as React from 'react';
import { motion } from 'framer-motion';
import axios from "axios";

import { Col, Row } from 'antd';
import moment from 'moment';
import { lazy } from "react";





const ModifierRv = lazy(() => import("./ModifierRv"));
const AjouterRendezVous = lazy(() => import("./AjouterRendezVous"));












function RendezVous() {
  const [showTable, setShowTable] = useState(true);
  // Ajouter un patient
  const [showAjouterForm, setShowAjouterForm] = useState(false);

  const handleAddClick = () => {
    setShowModifierForm(false);
    setShowAjouterForm(true);
    setShowTable(false);
  };

  // Modifier un patient
  const [selectedRendezvousId, setSelectedRendezvousId] = useState(null);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});

  const handleModifyClick = (id) => {
    const selectedRendezvous = dataSource.find((rendezvous) => rendezvous.id === id);
    setSelectedRendezvousId(id);
    setInitialFormValues({
      id: selectedRendezvous.id,
      nomPatient: selectedRendezvous.nomPatient,
      medecin: selectedRendezvous.medecin,
      maladie: selectedRendezvous.maladie,
      emailPatient: selectedRendezvous.emailPatient,
      dateRv: selectedRendezvous.dateRv,
    });
    setShowModifierForm(true);
    setShowAjouterForm(false);
    setShowTable(false);
  };

  const handleModifierFormSubmit = (values) => {
    axios.put(`/api/rendezvouses/${selectedRendezvousId}`, values)
      .then(() => {
        // Mise à jour réussie, effectuer toute logique nécessaire ou rediriger
        setSelectedRendezvousId(null);
        setShowModifierForm(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du rendez-vous :', error);
      });
  };

  // Supprimer un rendez-vous
  const handleDelete = (key) => {
    setLoading(true);
    axios
      .delete(`/api/rendezvouses/${key}`)
      .then(() => {
        // Suppression réussie, mettre à jour les données du tableau
        setCurrentPage(1); // Revenir à la première page
        setLoading(false);

        // Récupérer les données mises à jour après la suppression
        axios
          .get(`/api/rendezvouses?page=${currentPage}&limit=${pageSize}`)
          .then((response) => {
            setDataSource(response.data['hydra:member']);
            setTotalItems(response.data['hydra:totalItems']);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des données depuis l'API :", error);
          });
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression des données :", error);
        setLoading(false);
      });
  };

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    const fetchRendezvouss = () => {
      const params = {
        page: currentPage,
        itemsPerPage: pageSize,
        nom_patient: searchText,
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/rendezvouses?pagination=true", { params })
        .then((response) => {
          setDataSource(response.data['hydra:member']);
          setTotalItems(response.data['hydra:totalItems']);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données depuis l'API :", error);
          setLoading(false);
        });
    };
  
    setLoading(true);
    fetchRendezvouss();
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
    { title: "Nom du patient", dataIndex: "nomPatient", key: "nomPatient",  },
    { title: "Email du patient", dataIndex: "emailPatient", key: "emailPatient", },
    { title: "Maladie", dataIndex: "maladie", key: "maladie",  },
    { title: "Médecin", dataIndex: "medecin", key: "medecin",  },
    {
      title: "Date du rendez-vous", dataIndex: "dateRv", key: "dateRv",
      render: (dateRv) => moment(dateRv).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      
      fixed: 'right',
      
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" onClick={() => handleModifyClick(record.id)}>
            Modifier
          </Button>
          <Popconfirm title="Êtes-vous sûr de vouloir supprimer ?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Supprimer</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];


  

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      
          {showTable && (
            <Space size={20} direction="vertical" style={{ width: '100%' }} >
              <Typography.Title level={4}>Rendez-vous</Typography.Title>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full font-medium antialiased"                
                onClick={() => handleAddClick()}
                type="primary"
                variant="contained"
                disableElevation
              >
                <b>Ajouter un rendez-vous</b>
              </button>
              {/* Tableu d'affichage des données */}
              <Input.Search
                style={{ width: '200px' }}
                placeholder="Rechercher par nom"
                onSearch={handleSearch}
                enterButton
              />


    <Table
      style={{
        borderRadius: '10px',
        border: '2px solid rgba(0, 0, 0, 0.1)',
      }}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalItems,
        position: ['bottomCenter'],
      }}
      onChange={handleTableChange}
    />
 
            
             
            </Space>
          )}
       
      {showModifierForm && (
        <ModifierRv
          initialValues={initialFormValues}
          onSubmit={handleModifierFormSubmit}
        />
      )}

      {showAjouterForm &&
        <AjouterRendezVous />
      }
    </motion.div>
  );
}

export default RendezVous;
