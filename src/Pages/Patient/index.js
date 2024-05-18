import { Space, Table, Typography, Popconfirm, Button, Input, } from "antd";
import { useEffect, useState } from "react";
import * as React from 'react';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import axios from "axios";


import { lazy } from "react";

const ModifierPatient = lazy(() => import("./ModifierPatient"));
const AjouterPatient = lazy(() => import("./AjouterPatient"));










function Patient() {
  const [showTable, setShowTable] = useState(true);
  const [showAjouterForm, setShowAjouterForm] = useState(false);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');


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
  
  

  const handleAddClick = () => {
    setShowModifierForm(false);
    setShowAjouterForm(true);
    setShowTable(false);
  };

  const handleModifyClick = (id) => {
    const selectedPatient = dataSource.find((patient) => patient.id === id);
    setSelectedPatientId(id);
    setInitialFormValues({
      id: selectedPatient.id,
      nom: selectedPatient.nom,
      sexe: selectedPatient.sexe,
      age: selectedPatient.age,
      email: selectedPatient.email,
      tel: selectedPatient.tel,
      adresse: selectedPatient.adresse,
      cin: selectedPatient.cin,
    });
    setShowModifierForm(true);
    setShowAjouterForm(false);
    setShowTable(false);
  };

  const handleModifierFormSubmit = (values) => {
    axios.put(`/api/patients/${selectedPatientId}`, values)
      .then(() => {
        setSelectedPatientId(null);
        setShowModifierForm(false);
        window.location.reload();
       
      })
      .catch((error) => {
        console.error('Error updating patient:', error);
      });
  };

  const handleDelete = (key) => {
    setLoading(true);
    axios
      .delete(`/api/patients/${key}`)
      .then(() => {
       
        setCurrentPage(1); 
        setLoading(false);

        
        axios
          .get(`/api/patients?page=${currentPage}&limit=${pageSize}`)
          .then((response) => {
            setDataSource(response.data['hydra:member']);
            setTotalItems(response.data['hydra:totalItems']);
          })
          .catch((error) => {
            console.error("Error fetching data from API:", error);
          });
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        setLoading(false);
      });
  };

  const columns = [
    
    { title: "Cin", dataIndex: "cin", key: "cin", },
    { title: "Nom", dataIndex: "nom", key: "nom",  },
    { title: "Age", dataIndex: "age", key: "age",  },
    { title: "Email", dataIndex: "email", key: "email",  },
    { title: "Tel", dataIndex: "tel", key: "tel",  },
    { title: "Adresse", dataIndex: "adresse", key: "adresse",  },
    
    {
      
      fixed: 'right',
      width: '200',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" onClick={() => handleModifyClick(record.id)}>
            Modifier
          </Button>
          <Popconfirm
  title={`Si vous avez supprimé un patient,toutes les données qui sont liées avec lui sont aussi supprimées.`}
  onConfirm={() => handleDelete(record.id)}
>
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
            <Space size={20} direction="vertical" style={{ width: '100%' }}>
              <Typography.Title level={4}>Etudiant</Typography.Title>
              <button
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full font-medium antialiased"                
                onClick={() => handleAddClick()}
                type="primary"
                variant="contained"
                disableElevation
              >
                <b>Ajouter un etudiant</b>
              </button>
              <Input.Search
                style={{ width: '200px' }}
                placeholder="Recherche par cin"
                onSearch={handleSearch}
                enterButton
              />
              <Table
              style={{borderRadius: '10px',
              border: '2px solid rgba(0, 0, 0, 0.1)'}}
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
              ></Table>
            </Space>
          )}
       
      {showModifierForm && (
        <ModifierPatient
          initialValues={initialFormValues}
          onSubmit={handleModifierFormSubmit}
        />
      )}
      {showAjouterForm && <AjouterPatient />}
    </motion.div>
  );
}

export default Patient;
