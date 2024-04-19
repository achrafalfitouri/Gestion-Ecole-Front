import {  Button,  Col, Form, Input, Row, Select, Typography,  } from 'antd';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

import axios from 'axios';

const { Option } = Select;
const MyFormItemContext = React.createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};



const AjouterPatient = ({ onSubmit }) => {
  const [, setNavigate] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    sexe: '',
    age: '',
    email: '',
    tel: '',
    adresse: '',
    cin: '',
  });


  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  const handlePost = () => {
    const currentDateTime = new Date().toISOString();
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
            createdAt: currentDateTime,
            user: userData && userData.id ? `api/users/${userData.id}` : null,
          };
  
         
          axios
            .post('/api/patients', postData)
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
          setNavigate(true);
        });
    } else {
      setNavigate(true);
    }
  };
  
  
  const onFinish = (value) => {
    console.log(value);
    onSubmit(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
        <Typography.Title level={4}>Ajouter un Patient</Typography.Title>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <MyFormItemGroup prefix={['user']}>
              <MyFormItemGroup prefix={['name']}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Form.Item name="nom" label="Nom" rules={[{ required: true, message: 'Veuillez sélectionner le nom!' }]} >
                    <Input value={formData.nom} onChange={(e) => handleInputChange('nom', e.target.value)} type='text' placeholder='Veuillez saisir nom' />
                  </Form.Item>
                  <Form.Item name="cin" label="CIN" rules={[{ required: true, message: 'Veuillez saisir le cin!' }]}>
                    <Input value={formData.cin} onChange={(e) => handleInputChange('cin', e.target.value)} type='text' placeholder='Veuillez saisir cin' />
                  </Form.Item>
                </div>

                <MyFormItemGroup>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Veuillez saisir l'email!" },
                      ]}
                    >
                      <Input value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} type='email' placeholder="Veuillez saisir l'email"/>
                    </Form.Item>
                    <Form.Item name="age" label="Age" >
                      <Input value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} type="number" placeholder="Veuillez saisir  l'age" />
                    </Form.Item>
                  </div>
                </MyFormItemGroup>
              </MyFormItemGroup>
              <Form.Item
                name="sexe"
                label="Sexe"
                
              >
                <Select value={formData.sexe} onChange={(value) => handleInputChange('sexe', value)} placeholder="Veuillez sélectionner le sexe!">
                  <Option value="Masculin">Masculin</Option>
                  <Option value="Féminin">Féminin</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="tel"
                label="Tele"
                
              >
                <Input value={formData.tel} onChange={(e) => handleInputChange('tel', e.target.value)} type="text" style={{ width: '100%' }} placeholder='Veuillez saisir télephone' />
              </Form.Item>
              <Form.Item
                name="adresse"
                label="Adresse"
                
              >
                <Input value={formData.adresse} onChange={(e) => handleInputChange('adresse', e.target.value)} type="text" placeholder="Veuillez saisir l'addresse" />
              </Form.Item>
            </MyFormItemGroup>
            <Button danger type="text" href="/patient">
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

export default AjouterPatient;
