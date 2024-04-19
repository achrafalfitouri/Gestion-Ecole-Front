import {  Space, Table, Typography, Popconfirm, Button, Input ,Drawer,Divider} from "antd";
import { useEffect, useState } from "react";
import * as React from 'react';
import { motion } from 'framer-motion';
import axios from "axios";

import { Col, Row } from 'antd';
import { lazy} from "react";

const ModifierVital = lazy(() => import("./ModifierVital"));

const AjouterVital = lazy(() => import("./AjouterVital"));







function Vital() {
  const [showTable, setShowTable] = useState(true);
  // voir vital
  const [selectedPatientData, setSelectedPatientData] = useState({});

  const [initialFormValues1, setInitialFormValues1] = useState({});
  const [, setSelectedVitalId1] = useState(null);
  const handleVoirClick = (id) => {
    const selectedVital1 = dataSource.find((vital) => vital.id === id);
    setSelectedVitalId1(id);
    setInitialFormValues1({
        id: selectedVital1.id,
        assurance: selectedVital1.assurance,
    allergies: selectedVital1.allergies,
    taille: selectedVital1.taille,
    antecedentsMedicaux: selectedVital1.antecedentsMedicaux,
    medicamentActuel: selectedVital1.medicamentActuel,
    nemuroAssurance: selectedVital1.nemuroAssurance,
    groupeSanguin: selectedVital1.groupeSanguin,
    tensionArtetielle: selectedVital1.tensionArtetielle,
    frequenceCardiaque: selectedVital1.frequenceCardiaque,
    antecedentsFamiliaux: selectedVital1.antecedentsFamiliaux,
    nomPatient: selectedVital1.nomPatient,
    poids: selectedVital1.poids
      
      });
      setSelectedPatientData(selectedVital1); // Set the selected patient's data

   
      setOpen(true);


   
  };

  const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">{title}:</p>
      {content}
    </div>
  );

  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };








//end voir vital
  // ajouter vital
  const [showAjouterForm, setShowAjouterForm] = useState(false);

  const handleAddClick = () => {
    setShowModifierForm(false);
    setShowAjouterForm(true);
    setShowTable(false);
  };

  // modifier vital
  const [selectedVitalId, setSelectedVitalId] = useState(null);
  const [showModifierForm, setShowModifierForm] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});

  const handleModifyClick = (id) => {
    const selectedVital = dataSource.find((vital) => vital.id === id);
    setSelectedVitalId(id);
    setInitialFormValues({
      id: selectedVital.id,
      assurance: selectedVital.assurance,
  allergies: selectedVital.allergies,
  taille: Number(selectedVital.taille),
  antecedentsMedicaux: selectedVital.antecedentsMedicaux,
  medicamentActuel: selectedVital.medicamentActuel,
  nemuroAssurance: selectedVital.nemuroAssurance,
  groupeSanguin: selectedVital.groupeSanguin,
  tensionArtetielle: selectedVital.tensionArtetielle,
  frequenceCardiaque: Number(selectedVital.frequenceCardiaque),
  antecedentsFamiliaux: selectedVital.antecedentsFamiliaux,
  nomPatient: selectedVital.nomPatient,
  poids: Number(selectedVital.poids),

    
    });
    setShowModifierForm(true);
    setShowAjouterForm(false);
    setShowTable(false);
  };

  const handleModifierFormSubmit = (values) => {
    axios.put(`/api/vitals/${selectedVitalId}`, values)
      .then(() => {
        // Update successful, perform any necessary logic or redirect
        setSelectedVitalId(null);
        setShowModifierForm(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating patient:', error);
      });
  };

  // delete vitals
  const handleDelete = (key) => {
    setLoading(true);
    axios
      .delete(`/api/vitals/${key}`)
      .then(() => {
        // Delete successful, update the table data
        setCurrentPage(1); // Reset to the first page
        setLoading(false);

        // Fetch the updated data after deletion
        axios
          .get(`/api/vitals?page=${currentPage}&limit=${pageSize}`)
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
  const [searchText, setSearchText] = useState('');

  

  useEffect(() => {
    const fetchVitals = () => {
      const params = {
        page: currentPage,
        itemsPerPage: pageSize,
        nom_patient: searchText,
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/vitals?pagination=true", { params })
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
    fetchVitals();
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
    { title: "Nom de patient", dataIndex: "nomPatient", key: "nomPatient", width: '30%' },
    { title: "Assurance", dataIndex: "assurance", key: "assurance", width: '30%' },
    { title: "Nemuro d'assurance", dataIndex: "nemuroAssurance", key: "nemuroAssurance", width: '30%' },
    {
        title: "Action",
        fixed: 'right',
        width: '200',
        render: (_, record) => (
          <div style={{ display: 'flex', gap: '10px' }}>
   <Button  onClick={() => handleVoirClick(record.id)}>
        Voir vital
      </Button>

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
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Row>
        <Col xs={{ span: 1, offset: -1 }}>
          {showTable && (
            <Space size={20} direction="vertical">
              <Typography.Title level={4}>Vital</Typography.Title>
              <Button
                onClick={() => handleAddClick()}
                type="primary"
                variant="contained"
                disableElevation
              >
                <b>Ajouter une vital</b>
              </Button>
              <Input.Search
                style={{ width: '200px' }}
                placeholder="Rechercher par nom "
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

      {showModifierForm && (
        <ModifierVital
          initialValues={initialFormValues}
          onSubmit={handleModifierFormSubmit}
        />
      )}

      {showAjouterForm &&
        <AjouterVital />
      }


 
  <>
    <Drawer width={640} title="Vital " placement="right" initialValues={initialFormValues1} onClose={onClose} open={open}>
    
      <>
        <p  className="site-description-item-profile-p"><strong>Informations du patient :</strong></p>
        <Row>
          <Col span={12}>
            <DescriptionItem title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Nom de patient</span>}   content={selectedPatientData.nomPatient}/>
          </Col>
          <Col span={12}>
            <DescriptionItem title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Assurance</span>}  content={selectedPatientData.assurance} />
          </Col>
          <Col span={12}>
            <DescriptionItem  title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Nemuro d'assurance</span>}   content={selectedPatientData.nemuroAssurance} />
          </Col>
        </Row>
    
        <Divider />
        <p className="site-description-item-profile-p"> <strong>Informations médicales :</strong></p>
        <Row>
          <Col span={12}>
            <DescriptionItem  title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Allergies</span>} content={selectedPatientData.allergies} />
          </Col>
          <Col span={12}>
            <DescriptionItem   title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Antécédents médicaux</span>} content={selectedPatientData.antecedentsMedicaux} />
          </Col>
          <Col span={12}>
            <DescriptionItem   title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>MédicamentActuel</span>}     content={selectedPatientData.medicamentActuel} />
          </Col>
        </Row>
     
        <Divider />
        <p className="site-description-item-profile-p"> <strong>Informations supplémentaires :</strong> </p>
        <Row>
          <Col span={12}>
            <DescriptionItem   title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Poids</span>}   content={`${selectedPatientData.poids} kg`  }   />
          </Col>
          <Col span={12}>
            <DescriptionItem  title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Taille</span>}  content={`${selectedPatientData.taille} cm`}  />
          </Col>
          
        </Row>
     
        <Divider />
       
        <p className="site-description-item-profile-p"> <strong>Mesures de santé :</strong> </p>
        <Row>
          <Col span={12}>
            <DescriptionItem title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Groupe sanguin</span>}  content={selectedPatientData.groupeSanguin} />
          </Col>
          <Col span={12}>
            <DescriptionItem  title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Tension artérielle</span>}   content={`${selectedPatientData.tensionArtetielle} mmHg`}/>
          </Col>
          
        </Row>
     
        <Divider />
        <p className="site-description-item-profile-p"><strong>Santé cardiaque :</strong>   </p>
        <Row>
          <Col span={12}>
            <DescriptionItem  title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Fréquence cardiaque</span>}  content={`${selectedPatientData.frequenceCardiaque} bpm`} />
          </Col>
          <Col span={12}>
            <DescriptionItem title={<span style={{ fontFamily: 'Your-Font-Family', fontWeight: 'bold' }}>Antécédents familiaux</span>}   content={selectedPatientData.antecedentsFamiliaux} />
          </Col>
          
        </Row>
     
        <Divider />
      </>
    </Drawer>
  </>


    </motion.div>
  );
}

export default Vital;
