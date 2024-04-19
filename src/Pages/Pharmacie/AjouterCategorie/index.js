import { Button,  Col, Form, Input,  Row, Typography } from 'antd';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

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



const AjouterCategorie = ({ onSubmit }) => {
  const [, setNavigate] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    
    
    
  });


  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  const handlePost = () => {
    let userData; // Declare the userData variable
  
    // Fetch the user data
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
          userData = response.data; // Assign the userData value
  
          const postData = {
            ...formData,
            createdAt: new Date().toISOString(),
            user: userData && userData.id ? `api/users/${userData.id}` : null, // Check if userData and userData.id are defined
          };
  
         
          axios
            .post('/api/categoriems', postData)
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
        <Typography.Title level={4}>Ajouter un Categorie</Typography.Title>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <MyFormItemGroup prefix={['user']}>
             
            <Form.Item
                name="nom"
                label="Nom de categorie"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner de categorie!",
                  },
                ]}
              >
                <Input value={formData.nom} onChange={(e) => handleInputChange('nom', e.target.value)} type="text" />
              </Form.Item>
            </MyFormItemGroup>
            <Button danger type="text" href="/pharmacie">
              Annuler
            </Button>
            <Button type="primary" htmlType="submit" onClick={handlePost}>
              Enregistrer
            </Button>
          </Col>
        </Row>
      </Form>
    </motion.div>
  );
};

export default AjouterCategorie;
