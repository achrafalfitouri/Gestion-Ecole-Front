import {Button,  Col, Form, Input,  Row, Select, Typography,  Space, DatePicker } from 'antd';
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



const AjouterRendezVous = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nomPatient: '',
    maladie: '',
    dateRv: '',
    emailPatient: '',
    medecin:'',
  });
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
  

  const handleSelectChange = (value, option) => {
    const selectedPatientData = patients.find((patient) => patient.id === value);
    setSelectedPatient(selectedPatientData);
    form.setFieldsValue({
      emailPatient: selectedPatientData ? selectedPatientData.email : ''
    });
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
            emailPatient: selectedPatient ? selectedPatient.email : '',
            patient: selectedPatient ? `api/patients/${selectedPatient.id}` : null,

          };

          axios
            .post('/api/rendezvouses', postData)
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
        <Typography.Title level={4}>Ajouter un rendez-vous</Typography.Title>
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
                onChange={handleSelectChange}
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

                    <Form.Item
                      name="emailPatient"
                      label="Email"
                      rules={[
                        { required: true, message: "Veuillez saisir l'email!" },
                      ]}
                    >
                      <Input disabled={selectedPatient} value={formData.emailPatient} onChange={(e) => handleInputChange('emailPatient', e.target.value)} type='email' />
                    </Form.Item>
                    <Form.Item name="maladie" label="maladie" rules={[{ required: true, message: "Veuillez saisir la maladie!" }]}>
                      <Input value={formData.maladie} onChange={(e) => handleInputChange('maladie', e.target.value)} type="text" />
                    </Form.Item>
                    
                  </div>



                  <Form.Item name="medecin" label="medecin" rules={[{ required: true, message: "Veuillez saisir le medecin!" }]}>
                      <Input value={formData.medecin} onChange={(e) => handleInputChange('medecin', e.target.value)} type="text" />
                    </Form.Item>

                  <Form.Item label="La date" name="dateRv">
                    <Space direction="vertical" size={24}>
                      <DatePicker
                        showTime
                        value={formData.dateRv ? moment(formData.dateRv) : null}
                        onChange={(date, dateString) => handleInputChange('dateRv', dateString)}
                      />
                    </Space>
                  </Form.Item>
                </MyFormItemGroup>
              </MyFormItemGroup>
            </MyFormItemGroup>
            
       
            <Button danger type="text" href="/rendezvous">
              Annuler
            </Button>
            <Button type="primary" htmlType="submit" onClick={handlePost}>
              Ajouter
            </Button>
          </Col>
        </Row>
      </Form>
    </motion.div>
  );
};

export default AjouterRendezVous;
