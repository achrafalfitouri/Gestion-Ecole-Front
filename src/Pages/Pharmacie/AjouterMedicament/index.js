import {  Button, Col, Form, Input,  Row, Select, Typography} from 'antd';
import React, { useState, useEffect } from 'react';
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


const AjouterMedicament = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: '',
    
    
    description: '',
    codeBare:'',
  });
  const [categoriems, setCategoriems] = useState([]);
  const [selectedCategoriem, setSelectedCategoriem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get('/api/categoriems')
      .then((response) => {
        setCategoriems(response.data['hydra:member']);
      })
      .catch((error) => {
        console.error('Error fetching categoriems:', error);
      });
  }, []);

  const handleSelectChange = (value, option) => {
    const selectedCategoriemData = categoriems.find((categoriem) => categoriem.id === value);
    setSelectedCategoriem(selectedCategoriemData);
    
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
            nomCategorie: selectedCategoriem ? selectedCategoriem.nom : '',
            categoriem: selectedCategoriem ? `api/categoriems/${selectedCategoriem.id}` : null,

          };

          axios
            .post('/api/medicaments', postData)
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
        <Typography.Title level={4}>Ajouter un medicament</Typography.Title>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <MyFormItemGroup prefix={['user']}>
              <MyFormItemGroup prefix={['name']}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  {/* <Form.Item name="nomCategoriem" label="Nom" rules={[{ required: true, message: 'Veuillez sélectionner le nom!' }]}>
                    <Input disabled={selectedCategoriem !== null} value={formData.nomCategoriem} onChange={(e) => handleInputChange('nomCategoriem', e.target.value)} type='text' />
                  </Form.Item> */}
                </div>

                <MyFormItemGroup>

                <Form.Item label="Selectionner un categorie"
               
                >
              <Select
                showSearch
                placeholder="Rechercher un categorie"
                
                optionFilterProp="children"
                onChange={handleSelectChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={categoriems.map((categoriem) => ({
                  value: categoriem.id,
                  label: categoriem.nom,
                  key: categoriem.id,
                }))}
              />
            </Form.Item>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>

                    <Form.Item
                      name="nom"
                      label="nom"
                      rules={[
                        { required: true, message: "Veuillez saisir le nom de medicament!" },
                      ]}
                    >
                      <Input  value={formData.nom} onChange={(e) => handleInputChange('nom', e.target.value)} type='text' />
                    </Form.Item>
                    <Form.Item name="codeBare" label="codeBare" rules={[{ required: true, message: "Veuillez saisir le codeBare!" }]}>
                      <Input value={formData.codeBare} onChange={(e) => handleInputChange('codeBare', e.target.value)} type="text" />
                    </Form.Item>
                    
                  </div>

 

                  <Form.Item name="description" label="Description" rules={[{ required: true, message: "Veuillez saisir la description!" }]}>

                      <Input.TextArea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} type="text" />
                    </Form.Item>

                  
                </MyFormItemGroup>
              </MyFormItemGroup>
            </MyFormItemGroup>
            
            {/* {selectedCategoriem && (
              <>
                <Form.Item name="email" label="Email du categoriem">
                  <Input type="text" disabled />
                </Form.Item>
              </>
            )} */}
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

export default AjouterMedicament;
