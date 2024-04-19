import {   Space, Table, Typography,Popconfirm,Button ,Input } from "antd";
import { useEffect, useState } from "react";
import * as React from 'react';
import { motion } from 'framer-motion';
import axios from "axios";

import { Col, Row } from 'antd';
import moment from 'moment';
import { lazy } from "react";

const AjouterResultat = lazy(() => import("./AjouterResultat"));
const AjouterTest = lazy(() => import("./AjouterTest"));
const VoirResultat = lazy(() => import("./VoirResultat"));
const ModifierTest = lazy(() => import("./ModifierTest"));
const ModifierResultat = lazy(() => import("./ModifierResultat"));












function Examen() {
  const [searchText, setSearchText] = useState('');

  const [showTable, setShowTable] = useState(true); 
  

//examen test


  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);





  useEffect(() => {
    const fetchTests = () => {
      const params = {
        page: currentPage,
        itemsPerPage: pageSize,
        nom_patient: searchText,
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/examentests?pagination=true", { params })
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
    fetchTests();
  }, [currentPage, pageSize, searchText]);
  

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const handleSearch = (value) => {
    setCurrentPage(1);
    setSearchText(value);
   
  };
  


 




//ajoutertest
const [showAjouterForm, setShowAjouterForm] = useState(false);

const handleAddClick = () => {
  setShowAfficherForm (false);
  setShowModifierForm1(false);
 setShowModifierForm(false);
  setShowAjouterForm(true);
  setShowAjouterForm1(false);
  setShowTable(false);
};
//ajouterresultat
const [showAjouterForm1, setShowAjouterForm1] = useState(false);

const handleAddClick1 = () => {
  setShowAfficherForm (false);
 setShowModifierForm(false);
  setShowAjouterForm(false);
  setShowAjouterForm1(true);
  setShowModifierForm1(false);
  setShowTable(false);
};
//afficherordonance


const [showAfficherForm, setShowAfficherForm] = useState(false);
const [, setSelectedUser] = useState(null);
const [, setSelectedExamenresultat] = useState([]);









//modifier examentest
const [selectedExamentestId, setselectedExamentestId] = useState(null);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});
  
 

 

  const handleModifyClick = (id) => {
    const selectedExamentest = dataSource.find((examentest) => examentest.id === id);
    setselectedExamentestId(id);
    setInitialFormValues({
      id: selectedExamentest.id,
      nomPatient: selectedExamentest.nomPatient,
      nomTest: selectedExamentest.nomTest,
      maladie: selectedExamentest.maladie,
      dateTest: selectedExamentest.dateTest,
     
    });
    setShowModifierForm1(false);
    setShowModifierForm(true);
    setShowAjouterForm(false);
    setShowTable(false);
    setShowAfficherForm (false);
    setShowAjouterForm1(false);

  };


  const handleModifierFormSubmit = (values, selectedOptions) => {
  

    axios.put(`/api/examentests/${selectedExamentestId}`, values)
      .then(() => {
        
        console.log(selectedOptions);
        setselectedExamentestId(null);
        setShowModifierForm(false);
        window.location.reload();
      
        
      })
      .catch((error) => {
        console.error('Error updating patient:', error);
      });
  };



  //delete examentest
  const handleDelete = (key) => {
    setLoading(true);
    axios
      .delete(`/api/examentests/${key}`)
      .then(() => {
        
        setCurrentPage(1); 
        setLoading(false);
        window.location.reload()

        
        axios 
          .get(`/api/examentests?page=${currentPage}&limit=${pageSize}`)
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
  
//end examen test


//examen resultat






//aficher resultat
const [initialFormValues1, setInitialFormValues1] = useState({});


const handleAfficherClick = (id) => {
  const selectedExamenresultat = examenresultat.find((examenresultats) => examenresultats.id === id);
  setSelectedExamenresultat(id);

  // Fetch user data based on selectedExamenresultat.user
  axios
    .get(`/api/users/${selectedExamenresultat.user.split("/").pop()}`)
    .then((response) => {
      setSelectedUser(response.data);
      const patientId = selectedExamenresultat.patient.split("/").pop();
      const userId = selectedExamenresultat.user.split("/").pop();
      const prefixedPatientId = `CM-${patientId}`; 
      setInitialFormValues1({
        id: selectedExamenresultat.id,
        patient: prefixedPatientId ,
        nomPatient: selectedExamenresultat.nomPatient,
        nomTest: selectedExamenresultat.nomTest,
        description: selectedExamenresultat.description,
        maladie: selectedExamenresultat.maladie,
        user: userId,
        email: response.data.email,
        nom: response.data.nom,
        tel: response.data.tel,
        adresse: response.data.adresse,
      });
      setShowAfficherForm(true);
      setShowModifierForm(false);
      setShowAjouterForm(false);
      setShowAjouterForm1(false);
      setShowModifierForm1(false);
      setShowTable(false);
     
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
};




const [examenresultat, setExamenresultat] = useState([]);
  

useEffect(() => {
  const fetchResultats = () => {
    const params = {
      page: currentPage,
      itemsPerPage: pageSize,
      nom_patient: searchText,
      'order[created_at]': 'DESC'
    };

    axios
      .get("/api/examenresultats?pagination=true", { params })
      .then((response) => {
        setExamenresultat(response.data['hydra:member']);
        setTotalItems(response.data['hydra:totalItems']);
        setLoading(false);
        
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
        setLoading(false);
      });
  };

  setLoading(true);
  fetchResultats();
}, [currentPage, pageSize, searchText]);



//modifier examenresultat
const [selectedExamenresultatId, setselectedExamenresultatId] = useState(null);
  const [showModifierForm1, setShowModifierForm1] = useState(false);
  
 

 

  const handleModifyClick1 = (id) => {
    const selectedExamenresultat = examenresultat.find((examenresultat => examenresultat.id === id));
    setselectedExamenresultatId(id);
    setInitialFormValues1({
      id: selectedExamenresultat.id,
      nomPatient: selectedExamenresultat.nomPatient,
      nomTest: selectedExamenresultat.nomTest,
      maladie: selectedExamenresultat.maladie,
      description: selectedExamenresultat.description,
     
    });
    setShowModifierForm(false);
    setShowModifierForm1(true);
    setShowAjouterForm(false);
    setShowTable(false);
    setShowAfficherForm (false);
    setShowAjouterForm1(false);

  };


  const handleModifierFormSubmit1 = (values, selectedOptions) => {
  

    axios.put(`/api/examenresultats/${selectedExamenresultatId}`, values)
      .then(() => {
        // Update successful, perform any necessary logic or redirect
       
        setselectedExamenresultatId(null);
        setShowModifierForm1(false);
        window.location.reload();
      
        
      })
      .catch((error) => {
        console.error('Error updating patient:', error);
      });
  };



  //delete examenrsultat
  const handleDelete1 = (key) => {
    setLoading(true);
    axios
      .delete(`/api/examenresultats/${key}`)
      .then(() => {
        
        setCurrentPage(1); 
        setLoading(false);
       window.location.reload()
        
        axios
          .get(`/api/examenresultats?page=${currentPage}&limit=${pageSize}`)
          .then((response) => {
            setExamenresultat(response.data['hydra:member']);
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
  








 


//search filter 














  const columns = [
  
    { title: "Nom de patient", dataIndex: "nomPatient", key: "nomPatient", width:'30%',
    },
    { title: "Nom de test", dataIndex: "nomTest", key: "nomTest", width:'30%',
     },
    { title: "Maladie", dataIndex: "maladie", key: "maladie" , width:'30%',
     },
   
    { title: "Date de test", dataIndex: "dateTest", key: "dateTest" , width:'30%',
     
    render: (dateTest) => moment(dateTest).format('YYYY-MM-DD HH:mm:ss')
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
      ,{
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
  

  const columns1 = [
   
    { title: "Nom de patient", dataIndex: "nomPatient", key: "nomPatient", width:'30%',
   },
    { title: "Nom de test", dataIndex: "nomTest", key: "nomTest", width:'30%',
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
            onClick={() => handleModifyClick1(record.id)} 
           

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
            
            onClick={() => handleAfficherClick(record.id)} // Pass the ID to the click handhreler
           

          >
            Afficher resultat
          </Button>
        ),
      }
      ,
      {
        dataIndex: 'operation',
        
        width: 100,
        render: (_, record) =>
          dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete1(record.id)}>
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
          <Typography.Title level={4}>Examen</Typography.Title>
          
         
        <Button
          onClick={() => handleAddClick()}
          type="primary"
          variant="contained"
          disableElevation
        >
          <b>Ajouter un test</b>
        </Button>
        <Col style={{marginTop: '-53px'}} xs={{ span: 1, offset: 9 }}>
        <Button
          onClick={() => handleAddClick1()}
          type="primary"
          variant="contained"
          disableElevation
        >
          <b>Ajouter une resultat</b>
        </Button> </Col>
     
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
            
          pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
            }}
            onChange={handleTableChange}

          ></Table>  
        
           <Table
            loading={loading}
            
            columns={columns1}
            
            dataSource={examenresultat}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              
            }}
            onChange={handleTableChange}
          ></Table>  
        </Space>)}</Col></Row>
    
        {showModifierForm && (
            <ModifierTest
              initialValues={initialFormValues}
              onSubmit={handleModifierFormSubmit}
            
            />
          )}
    
        {showAjouterForm && 
        <AjouterTest
        
        
        />
    
    
    
        }
        {showAjouterForm1 && 
        <AjouterResultat
        
        
        />
    
    
    
        }
    
    
        {showAfficherForm && 
        <VoirResultat
        initialValues={initialFormValues1}

       
        />
    
    
    
        }

{showModifierForm1 && (
            <ModifierResultat
              initialValues={initialFormValues1}
              onSubmit={handleModifierFormSubmit1}
            
            />
          )}
    
    
        </motion.div>
      );
}
export default Examen;
