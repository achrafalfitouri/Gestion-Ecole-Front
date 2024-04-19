import {  
    Button,
   
    Col,
    Form,
    Input,
   
    Row,
    Select,Typography } from 'antd';
import React from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';




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

const ModifierUtilisateur = ({ initialValues, onSubmit }) => {

//modifier util


const [form] = Form.useForm();

useEffect(() => {
  form.setFieldsValue(initialValues);
}, [form, initialValues]);


 
const onFinish = (values) => {
 
  const updatedValues = {
    ...values,
    specialite: Array.isArray(values.specialite) ? values.specialite : [values.specialite],
  };

  console.log('Submitted Values:', updatedValues);
  onSubmit(updatedValues);
};










    
  return (

    <motion.div 
initial={{opacity:0,translateX: -10,translateY:-10}}
animate={{opacity:1,translateY:-10}}
exit={{opacity:0}}
transition={{duration : 0.3, delay: 0.7}}



>

    <Form name="form_item_path" layout="vertical" initialValues={initialValues} onFinish={onFinish}>
          <Typography.Title level={4}>Modifier l'utilisateur</Typography.Title>
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
          
          </div>
          <MyFormItemGroup>
          <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between"}}>

          <Form.Item 
        name="email"
        label="E-mail"
        rules={[
          {
            
            message: "Veuillez saisir l'email!",
          },
          {
            required: true,
            message: "Veuillez saisir l'email!",
          },
        ]}
      >
        <Input type= 'email'/>
      </Form.Item>
        
          <Form.Item 
        name="password"
        label="Mot de passe"
        rules={[
          {
            
            message: "Veuillez saisir le mot de passe!",
          },
          {
            required: true,
            message: "Veuillez saisir le mot de passe!",
          },
        ]}
      >
        <Input type= 'password'/>
      </Form.Item>
        
        
        
        </div></MyFormItemGroup>
        </MyFormItemGroup>
        <Form.Item
          name="specialite"
          label="Role"
          rules={[
            {
              type: 'text',
              required: true,
              message: 'Veuillez selectionner le sexe!',
            },
          ]}
        >
          <Select placeholder="Veuillez selectionner le role!" >
          <Option value="Admin">Admin</Option>
            <Option value="Medecin">Medecin</Option>
            <Option value="Reception">Reception</Option>
          </Select>
        </Form.Item>
      
      <Form.Item
        name="tel"
        label="Tele"
        rules={[
          { 

            
            required: true,
            message: 'Veuillez saisir votre numéro de telephone!',
          },
        ]}
      >
        <Input type="text"
          
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
     

      <Form.Item name="adresse" label="Adresse"  rules={[
          { 
            required: true,
            message: "Veuillez saisir l'adresse!",
          },
        ]}> 
            <Input type="text" />
          </Form.Item>



      </MyFormItemGroup>
      
      <Button  href="/utilisateur" danger type="text"  >Annuler</Button>             
      <Button type="primary" htmlType="submit">
        Enregistrer
      </Button>
      </Col></Row>
    </Form></motion.div>
   
  );
};
export default ModifierUtilisateur ;