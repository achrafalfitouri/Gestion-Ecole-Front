import {  Table, Typography, Popconfirm, Button, Space,Input, } from "antd";
import { useEffect, useState} from "react";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Col, Row } from 'antd';
import axios from "axios";

import { lazy } from "react";


const ModifierMedicament = lazy(() => import("./ModifierMedicament"));
const AjouterMedicament = lazy(() => import("./AjouterMedicament"));
const AjouterCategorie = lazy(() => import("./AjouterCategorie"));







function Pharmacie() {
  const [showTable, setShowTable] = useState(true);
 

  const [showAjouterForm, setShowAjouterForm] = useState(false);

  const handleAddClick = () => {
    setShowModifierForm(false);
    setShowAjouterForm(true);
    setShowTable(false);
    setShowAjouterForm2(false);
  };

  const [showAjouterForm2, setShowAjouterForm2] = useState(false);

  const handleAddClick2 = () => {
    setShowModifierForm(false);
    setShowAjouterForm(false);
    setShowAjouterForm2(true);
    setShowTable(false);
  };

  const [selectedMedicamentId, setSelectedMedicamentId] = useState(null);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});
  const [searchText, setSearchText] = useState('');


  const handleModifyClick = (id) => {
    const selectedMedicament = dataSource.find((medicament) => medicament.id === id);
    setSelectedMedicamentId(id);
    setInitialFormValues({
      id: selectedMedicament.id,
      nom: selectedMedicament.nom,
      codeBare: selectedMedicament.codeBare,
      nomCategorie: selectedMedicament.nomCategorie,
      description: selectedMedicament.description,
    });
    setShowModifierForm(true);
    setShowAjouterForm(false);
    setShowTable(false);
  };

  const handleModifierFormSubmit = (values) => {
    axios.put(`/api/medicaments/${selectedMedicamentId}`, values)
      .then(() => {
        setSelectedMedicamentId(null);
        setShowModifierForm(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating medicament:', error);
      });
  };

  const handleDelete = (key) => {
    setLoading(true);
    axios
      .delete(`/api/medicaments/${key}`)
      .then(() => {
        setCurrentPage(1);
        setLoading(false);

        axios
          .get(`/api/medicaments?page=${currentPage}&limit=${pageSize}`)
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

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);


  useEffect(() => {
    const fetchPharmacies = () => {
      const params = {
        page: currentPage,
        itemsPerPage: pageSize,
        nom: searchText,
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/medicaments?pagination=true", { params })
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
    fetchPharmacies();
  }, [currentPage, pageSize, searchText]);
  
  

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const handleSearch = (value) => {
    setCurrentPage(1);
    setSearchText(value);
   
  };



  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
  };
 

  const columns = [
    { title: "Nom", dataIndex: "nom", key: "nom"},
    { title: "Code bare", dataIndex: "code_bare", key: "code_bare", },
    { title: "Nom de categorie", dataIndex: "nom_categorie", key: "nom_categorie", },
    { title: "Description", dataIndex: "description", key: "description", },
    {
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleModifyClick(record.id)}
        >
          Modifier
        </Button>
      ),
    },
    {
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="text">Supprimer</Button>
          </Popconfirm>
        ) : null,
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
              <Typography.Title level={4}>Pharmacie</Typography.Title>
              <div style={buttonContainerStyle}>

              <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full font-medium antialiased"                

                onClick={() => handleAddClick()}
                type="primary"
                variant="contained"
                disableElevation
              >
                <b>Ajouter un medicament</b>
              </button>
            
        
              <button
className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full font-medium antialiased"                onClick={() => handleAddClick2()}
                type="primary"
                variant="contained"
                disableElevation
                
              >
                <b>Ajouter une categorie</b>
              </button> </div>
              <Input.Search
                style={{ width: '200px' }}
                placeholder="Rechercher par nom"
                onSearch={handleSearch}
                enterButton
              />
              <Table
               style={{borderRadius: '10px',
               border: '2px solid rgba(0, 0, 0, 0.1)' }} 
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
        <ModifierMedicament
          initialValues={initialFormValues}
          onSubmit={handleModifierFormSubmit}
        />
      )}

      {showAjouterForm && <AjouterMedicament />}

      {showAjouterForm2 && <AjouterCategorie />}
    </motion.div>
  );
}

export default Pharmacie;
