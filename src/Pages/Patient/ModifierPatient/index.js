import {   
    Button,
    
    Col,
    Form,
    Input,
    Row,
    Select,Typography} from 'antd';
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

const ModifierPatient  = ({ initialValues, onSubmit }) => {

  const [form] = Form.useForm();
  
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  
   
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
          <Typography.Title level={4}>Modifier le Patient</Typography.Title>
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
          <Form.Item name="cin" label="CIN"  rules={[
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
        
        
        <Form.Item name="age" label="Age" >
          <Input type="number" />
          
        </Form.Item></div></MyFormItemGroup>
        </MyFormItemGroup>
        <Form.Item
        name="sexe"
        label="Sexe"
       
      >
        <Select placeholder="Veuillez selectionner le sexe!">
          <Option value="Masculin">Masculin</Option>
          <Option value="Féminin">Féminin</Option>
         
        </Select>
      </Form.Item>
      
      <Form.Item
        name="tel"
        label="Tele"
        
      >
        <Input type="text"
          
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
     

      <Form.Item name="adresse" label="Adresse"  rules={[
          { 
            message: "Veuillez selectionner l'adresse!",
          },
        ]}> 
            <Input type="text" />
          </Form.Item>



      </MyFormItemGroup>
      
      <Button  href="/patient" danger type="text"  >Annuler</Button>             
      <Button type="primary" htmlType="submit">
        Enregistrer
      </Button>
      </Col></Row>
    </Form></motion.div>
   
  );
};
export default ModifierPatient ;