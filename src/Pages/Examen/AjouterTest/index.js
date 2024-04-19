import {  Button,  Col, Form, Input,  Row, Select, Typography, Space, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import moment from 'moment'; // Import moment.js library
import axios from 'axios';


const MyFormItemContext = React.createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};



const AjouterTest = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nomPatient: '',
    nomTest: '',
  
    
    maladie: '',
    dateTest: '',
  });



 

  //patient
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPatients = () => {
      const params = {
       
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/patients?pagination=true", { params })
        .then((response) => {
          setPatients(response.data['hydra:member']);
          
        })
        .catch((error) => {
          console.error("Error fetching data from API:", error);
         
        });
    };
  
    fetchPatients();
  }, []);
  

  const handleSelectChange1 = (value, option) => {
    const selectedPatientData = patients.find((patient) => patient.id === value);
    setSelectedPatient(selectedPatientData);
    
  };


  const onSearch = (value) => {
    console.log('search:', value);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePost = () => {
    let userData;
  
    const token = Cookies.get('token');
    if (token) {
      axios
        .get('/api/user/me', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          userData = response.data;
  
  
          const postData = {
            ...formData,
            createdAt: new Date().toISOString(),
            user: userData && userData.id ? `api/users/${userData.id}` : null,
            nomPatient: selectedPatient ? selectedPatient.nom : '',
            
            patient: selectedPatient ? `api/patients/${selectedPatient.id}` : null,
          };
  
          axios
            .post('/api/examentests', postData)
            .then((response) => {
              console.log(response.data);
              console.log("User ID:", userData && userData.id);
              window.location.reload();
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  

  const onFinish = (values) => {
    console.log(values);
    onSubmit(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Form name="form_item_path" layout="vertical" onFinish={onFinish} form={form}>
        <Typography.Title level={4}>Ajouter un test</Typography.Title>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <MyFormItemGroup prefix={['user']}>
              <MyFormItemGroup prefix={['name']}>
              

                <MyFormItemGroup>
                  <Form.Item label="Selectionner un patient">
                    <Select
                      showSearch
                      placeholder="Rechercher un patient"
                      optionFilterProp="children"
                      onChange={handleSelectChange1}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={patients.map((patient) => ({
                        value: patient.id,
                        label: patient.nom,
                        key: patient.id,
                      }))}
                    />
                  </Form.Item>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <Form.Item name="nomTest" label="Nom de test" rules={[{ required: true, message: "Veuillez saisir le nom de test!" }]}>
                      <Input value={formData.nomTest} onChange={(e) => handleInputChange('nomTest', e.target.value)} type="text" />
                    </Form.Item>
                  
                 
                    <Form.Item name="maladie" label="Maladie" rules={[{ required: true, message: "Veuillez saisir la maladie!" }]}>
                      <Input value={formData.maladie} onChange={(e) => handleInputChange('maladie', e.target.value)} type="text" />
                    </Form.Item>
                  </div>
                
                  <Form.Item label="La date de test" name="dateTest">
                    <Space direction="vertical" size={24}>
                      <DatePicker
                        showTime
                        value={formData.dateTest ? moment(formData.dateTest) : null}
                        onChange={(date, dateString) => handleInputChange('dateTest', dateString)}
                      />
                    </Space>
                  </Form.Item>
                </MyFormItemGroup>

              </MyFormItemGroup>
            </MyFormItemGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <Form.Item>


            <Button href="/examen" danger type="text">
              Annuler
            </Button>
              <Button onClick={handlePost} type="primary" htmlType="submit">
                Ajouter
              </Button>
             
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </motion.div>
  );
};

export default AjouterTest;
