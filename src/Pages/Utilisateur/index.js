import {   Space, Table, Typography,Popconfirm,Button,Input } from "antd";
import { useEffect, useState } from "react";
import * as React from 'react';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import axios from "axios";

import { lazy} from "react";



const AjouterUtilisateur = lazy(() => import("./AjouterUtilisateur"));
const ModifierUtilisateur = lazy(() => import("./ModifierUtilisateur"));






function Utilisateur() {
 
  
  const [searchText, setSearchText] = useState('');
  const [showTable, setShowTable] = useState(true); 

  
  

//ajouterutilisateur
const [currentPage, setCurrentPage] = useState(1);
const [loading, setLoading] = useState(false);
const [dataSource, setDataSource] = useState([]);

const [pageSize, setPageSize] = useState(5);
const [totalItems, setTotalItems] = useState(0);
//Définition des états pour la pagination, le chargement, la source de données, la taille de page et le nombre total d'éléments.




useEffect(() => {
  const fetchUsers = () => {
    const params = {
      page: currentPage,
      itemsPerPage: pageSize,
      nom: searchText,
      'order[created_at]': 'DESC'
    };

    axios
      .get("/api/users?pagination=true", { params })
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
  fetchUsers();
}, [currentPage, pageSize, searchText]);

//end
// Manipilation de changment de table
const handleTableChange = (pagination) => {
  setCurrentPage(pagination.current);
  setPageSize(pagination.pageSize);
};
const handleSearch = (value) => {
  setCurrentPage(1);
  setSearchText(value);
 
};

const [showAjouterForm, setShowAjouterForm] = useState(false);

const handleAddClick = () => {
 
 setShowModifierForm(false);
  setShowAjouterForm(true);
  setShowTable(false);
};


















//modifier utilisateur
const [selectedUtilisateurId, setSelectedUtilisateurId] = useState(null);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});
  
 

 

  const handleModifyClick = (id) => {
    const selectedUtilisateur = dataSource.find((user) => user.id === id);
    setSelectedUtilisateurId(id);
    setInitialFormValues({
      id: selectedUtilisateur.id,
      email: selectedUtilisateur.email,
      nom: selectedUtilisateur.nom,
      adresse: selectedUtilisateur.adresse,
      tel: selectedUtilisateur.tel,
      specialite: selectedUtilisateur.specialite
    });
    setShowModifierForm(true);
    setShowAjouterForm(false);
    setShowTable(false);
  };

  const handleModifierFormSubmit = (values) => {
    console.log(selectedUtilisateurId);
    axios.put(`/api/users/${selectedUtilisateurId}`, values)
      .then(() => {
        
        setSelectedUtilisateurId(null);
        
        setShowModifierForm(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating utilisateur:', error);
      });
  };



//delete utilisateur
  const handleDelete = (key) => {
    setLoading(true);
    axios
      .delete(`/api/users/${key}`)
      .then(() => {
        
        setCurrentPage(1); 
        setLoading(false);
  
        
        axios
          .get(`/api/users?page=${currentPage}&limit=${pageSize}`)
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
   
    { title: "Email", dataIndex: "email", key: "email" , width: '30%',
     },
    { title: "nom", dataIndex: "nom", key: "nom", width: '30%',
    },
    
   
    
    { title: "Tel", dataIndex: "tel", key: "tel" , width: '30%',
     },
    { title: "Adresse", dataIndex: "adresse", key: "adresse" , width: '30%',
     },
     { title: "Roles", dataIndex: "specialite", key: "specialite" , width: '30%',
     },
    
     {
      title: "Action",
      fixed: 'right',
      width: '200',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" onClick={() => handleModifyClick(record.id)}>
            Modifier
          </Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Supprimer</Button>
          </Popconfirm>
        </div>
      ),
    },

  ];
    

  

  
 
  return (
<motion.div 
initial={{opacity:0,translateX: -10,translateY:-10}}
animate={{opacity:1,translateY:-10}}
exit={{opacity:0}}
transition={{duration : 0.3, delay: 0.7}}



>


    <Row>
    <Col
  xs={{
    span: 1,
    offset: -1,
  }}
  
>
{showTable && (<Space size={20} direction="vertical">
      <Typography.Title level={4}>Utilisateur</Typography.Title>
      
     
    <Button
      onClick={() => handleAddClick()}
      type="primary"
      variant="contained"
      disableElevation
    >
      <b>Ajouter un utilisateur</b>
    </Button>

    {/* la table des utilisateurs */}
    
    <Input.Search
                style={{ width: '200px' }}
                placeholder="Search by name"
                onSearch={handleSearch}
                enterButton
              />
    
       <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}

        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
        }}
      ></Table>  
    </Space>)}</Col></Row>

    {showModifierForm && (
        <ModifierUtilisateur
          initialValues={initialFormValues}
          onSubmit={handleModifierFormSubmit}
        />
      )}

    {showAjouterForm && 
    <AjouterUtilisateur
    
    
    
    />



    }


    </motion.div>
  );
}
export default Utilisateur;
