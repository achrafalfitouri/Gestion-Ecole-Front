import {   
  Button,
 
  Col,
  Form,
  Input,
  
  Row,
  Select,Typography } from 'antd';
import React from 'react';
import { motion } from 'framer-motion';
import { useState,useEffect } from 'react';
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

const ModifierMedicament  = ({ initialValues, onSubmit }) => {


const [form] = Form.useForm();
const [categoriems, setCategoriems] = useState([]);

useEffect(() => {
  form.setFieldsValue(initialValues);
}, [form, initialValues]);

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




const onSearch = (value) => {
  console.log('search:', value);
};
 
    const onFinish = (values) => {
      onSubmit(values);
    };
  
return (

  <motion.div 
initial={{opacity:0,translateX: -10,translateY:-10}}
animate={{opacity:1,translateY:-10}}
exit={{opacity:0}}
transition={{duration : 0.3, delay: 0.7}}



>

  <Form name="form_item_path" layout="vertical" initialValues={initialValues} onFinish={onFinish}>
        <Typography.Title level={4}>Modifier le Medicament</Typography.Title>
        <Row>
  <Col
xs={{
  span: 9,
  offset: 7,
}}

>
    <MyFormItemGroup prefix={['user']}>
      <MyFormItemGroup prefix={['name']}>
      <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between"}}>
        <Form.Item name="nom" label="Nom"  rules={[
        { 
          
          required: true,
          message: 'Veuillez selectionner le nom!',
        },
      ]}> 
          <Input type= 'text' />
        </Form.Item>
        {/* <MyFormItem name="firstName" label="Prenom"  rules={[
        {
          required: true,
          message: 'Veuillez selectionner le prenom!',
        },
      ]}>
          <Input />
        </MyFormItem> */}
        </div>
        <MyFormItemGroup>
        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between"}}>

        <Form.Item 
      name="codeBare"
      label="code_bare"
      rules={[
        {
          
          message: "Veuillez saisir le code_bare!",
        },
        {
          required: true,
          message: "Veuillez saisir le code_bare!",
        },
      ]}
    >
      <Input type= 'text'/>
    </Form.Item>
      
      
      <Form.Item name="description" label="description"  rules={[
        { 
          
          required: true,
          message: "Veuillez saisir la desciption!",
        },
      ]}>
        <Input type="text" />
        
      </Form.Item></div></MyFormItemGroup>
      </MyFormItemGroup>
      <Form.Item
      name="nomCategorie"
      label="categorie"
      rules={[
        { type:"text",
          required: true,
          message: 'Veuillez selectionner categorie!',
        },
      ]}
    >
      <Select
                showSearch
                placeholder="Rechercher une categorie"
                optionFilterProp="children"
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={categoriems.map((categoriem) => ({
                  value: categoriem.nom,
                  label: categoriem.nom_categorie,
                }))}
              />
    </Form.Item>
    
    

    </MyFormItemGroup>
    
    <Button  href="/medicament" danger type="text"  >Annuler</Button>             
    <Button type="primary" htmlType="submit">
      Enregistrer
    </Button>
    </Col></Row>
  </Form></motion.div>
 
);
};
export default ModifierMedicament ;