import {   
    Button,
    
    Col,
    Form,
    Input,
    
    Row,
    Select,Typography } from 'antd';
import React from 'react';
import { motion } from 'framer-motion';
import  { useState } from 'react';
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

const AjouterUtilisateur = ({ onSubmit }) => {


//ajouter utilisateur

  const [formData, setFormData] = useState({
    nom: '',
    roles: [],
    password: '',
    email: '',
    tel: '',
    adresse: '',
    specialite: []
  });


  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePost = () => {
    const currentDateTime = new Date().toISOString();
    
    const postData = {
      ...formData,
      createdAt: currentDateTime,
    };
  
    axios
      .post('/api/users', postData)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  const onFinish = (value) => {
    console.log(value);
    onSubmit(value);
    handlePost();
  };















  
  return (
    <motion.div
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
        <Typography.Title level={4}>Ajouter un utilisateur</Typography.Title>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <MyFormItemGroup prefix={['user']}>
              <MyFormItemGroup prefix={['name']}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Form.Item name="nom" label="Nom" rules={[{ required: true, message: 'Veuillez saisir le nom!' }]}>
                    <Input value={formData.nom} onChange={(e) => handleInputChange('nom', e.target.value)} type='text' placeholder='Veuillez saisir nom'/>
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
                      <Input value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} type='email' placeholder='Veuillez saisir email' />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: "Veuillez saisir le password!" }]}>
                      <Input value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} type="password" placeholder='saisir mot de passe' />
                    </Form.Item>
                  </div>
                </MyFormItemGroup>
              </MyFormItemGroup>
              <Form.Item
  name="specialite"
  label="Role"
  rules={[
    {
      required: true,
      message: 'Veuillez sélectionner le role!',
    },
  ]}
>
  <Select
    value={formData.specialite}
    onChange={(values) => handleInputChange('specialite', [values])} 
    placeholder="Veuillez sélectionner le(s) rôle(s)!" 
  >
    <Option value="Admin">Admin</Option>
    <Option value="Medecin">Medecin</Option>
    <Option value="Reception">Reception</Option>
  </Select>
</Form.Item>

              <Form.Item
                name="tel"
                label="Tele"
              
              >
                <Input value={formData.tel} onChange={(e) => handleInputChange('tel', e.target.value)} type="text" style={{ width: '100%' }} placeholder='Veuillez saisir le telephone' />
              </Form.Item>
              <Form.Item
                name="adresse"
                label="Adresse"
               
              >
                <Input value={formData.adresse} onChange={(e) => handleInputChange('adresse', e.target.value)} type="text" placeholder="Veuillez saisir l'adresse" />
              </Form.Item>
            </MyFormItemGroup>
            <Button danger type="text" href="/utilisateur">
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
export default AjouterUtilisateur ;