import {  Space, Table, Typography,Popconfirm,Button ,Input } from "antd";
import { useEffect, useState } from "react";

import * as React from 'react';
import { motion } from 'framer-motion';
import axios from "axios";
import { Col, Row } from 'antd';

import { lazy } from "react";



const ModifierOrdonance = lazy(() => import("./ModifierOrdonance"));
const AjouterOrdonance = lazy(() => import("./AjouterOrdonance"));
const VoirOrdonance = lazy(() => import("./VoirOrdonance"));















function Ordonance() {
  
  const [searchText, setSearchText] = useState('');
  const [showTable, setShowTable] = useState(true); 

//ajouterordonance
const [showAjouterForm, setShowAjouterForm] = useState(false);

const handleAddClick = () => {
  setShowAfficherForm (false);
 setShowModifierForm(false);
  setShowAjouterForm(true);
  setShowTable(false);
};


//afficherordonance


const [showAfficherForm, setShowAfficherForm] = useState(false);
const [, setSelectedUser] = useState(null);

const handleAfficherClick = (id) => {
  const selectedOrdonance = dataSource.find((ordonance) => ordonance.id === id);
  setSelectedOrdonanceId(id);

  
  axios
    .get(`/api/users/${selectedOrdonance.user.split("/").pop()}`)
    .then((response) => {
      setSelectedUser(response.data);
      const patientId = selectedOrdonance.patient.split("/").pop();
      const userId = selectedOrdonance.user.split("/").pop();
      const prefixedPatientId = `CM-${patientId}`; 
      setInitialFormValues({
        id: selectedOrdonance.id,
        patient: prefixedPatientId ,
        nomPatient: selectedOrdonance.nomPatient,
        nomMedicament: selectedOrdonance.nomMedicament,
        description: selectedOrdonance.description,
        maladie: selectedOrdonance.maladie,
        user: userId,
        email: response.data.email,
        nom: response.data.nom,
        tel: response.data.tel,
        adresse: response.data.adresse,
      });
      setShowAfficherForm(true);
      setShowModifierForm(false);
      setShowAjouterForm(false);
      setShowTable(false);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
};








//modifier patient
const [selectedOrdonanceId, setSelectedOrdonanceId] = useState(null);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});
  
 

 

  const handleModifyClick = (id) => {
    const selectedOrdonance = dataSource.find((ordonance) => ordonance.id === id);
    setSelectedOrdonanceId(id);
    setInitialFormValues({
      id: selectedOrdonance.id,
      nomPatient: selectedOrdonance.nomPatient,
      nomMedicament: selectedOrdonance.nomMedicament,
      description: selectedOrdonance.description,
      maladie: selectedOrdonance.maladie,
     
    });
    setShowModifierForm(true);
    setShowAjouterForm(false);
    setShowTable(false);
    setShowAfficherForm (false);

  };


  const [, setMedicaments] = useState([]);
  const [, setSelectedMedicamentNames] = useState([]);

  useEffect(() => {
    axios
      .get('/api/medicaments')
      .then((response) => {
        setMedicaments(response.data['hydra:member']);
      })
      .catch((error) => {
        console.error('Error fetching medicaments:', error);
        
      });
  }, []);





  const handleModifierFormSubmit = (values, selectedOptions) => {
  

    axios.put(`/api/ordonances/${selectedOrdonanceId}`, values)
      .then(() => {
        // Update successful, perform any necessary logic or redirect
        setSelectedOrdonanceId(null);
        setShowModifierForm(false);
        window.location.reload();
      
        
      })
      .catch((error) => {
        console.error('Error updating patient:', error);
      });
  };













  //delete rendez vous
  const handleDelete = (key) => {
    setLoading(true);
    axios
      .delete(`/api/ordonances/${key}`)
      .then(() => {
        
        setCurrentPage(1); 
        setLoading(false);
  
        
        axios
          .get(`/api/ordonances?page=${currentPage}&limit=${pageSize}`)
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
    const fetchOrdonances = () => {
      const params = {
        page: currentPage,
        itemsPerPage: pageSize,
        nom_patient: searchText,
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/ordonances?pagination=true", { params })
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
    fetchOrdonances();
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
    
    { title: "Nom de patient", dataIndex: "nomPatient", key: "nomPatient", width:'30%',
    },
    {
      title: "Nom de medicament",
      dataIndex: "nomMedicament",
      key: "nomMedicament",
      width: '30%',
      render: (nomMedicament) => {
        let formattedMedicament = "";
        for (let i = 0; i < nomMedicament.length; i++) {
          formattedMedicament += nomMedicament[i];
          if (i !== nomMedicament.length - 1) {
            formattedMedicament += ", ";
          }} return formattedMedicament;},
        },
    { title: "Maladie", dataIndex: "maladie", key: "maladie" , width:'30%',
     },
   
   
 
     
   
   
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
      }
      ,
      {
        key: 'operation',
        fixed: 'right',
        width: 100,
        
        render: (_, record) => (
          <Button
            
            onClick={() => handleAfficherClick(record.id)} 
           

          >
            Afficher ordonance
          </Button>
        ),
      }
      ,
      {
        dataIndex: 'operation',
        
        width: 100,
        render: (_, record) =>
          dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
              <Button danger type="text">Supprimer</Button>
            </Popconfirm>
          ) : null,
      }
      ,

  ];
  













  return   (
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
          <Typography.Title level={4}>Ordonance</Typography.Title>
          
         
        <Button
          onClick={() => handleAddClick()}
          type="primary"
          variant="contained"
          disableElevation
        >
          <b>Ajouter une ordonance</b>
        </Button>
     
        <Input.Search
                style={{ width: '200px' }}
                placeholder="Rechercher par nom"
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
        </Space>)}</Col></Row>
    
        {showModifierForm && (
            <ModifierOrdonance
              initialValues={initialFormValues}
              onSubmit={handleModifierFormSubmit}
              onMedicamentNamesChange={setSelectedMedicamentNames}
            />
          )}
    
        {showAjouterForm && 
        <AjouterOrdonance
        
        
        />
    
    
    
        }
    
    
        {showAfficherForm && 
        <VoirOrdonance
        
        initialValues={initialFormValues}
        />
    
    
    
        }
    
    
        </motion.div>
      );
}
export default Ordonance;
