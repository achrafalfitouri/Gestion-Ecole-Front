import { Button, Form, Input,Typography } from 'antd';
import React from 'react';

import { DatePicker, Space } from 'antd';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import { useEffect } from 'react';



const ModifierRv = ({ initialValues, onSubmit }) => {



  const MyFormItemContext = React.createContext([]);
  function toArr(str) {
    return Array.isArray(str) ? str : [str];
  }
  const MyFormItemGroup = ({ prefix, children }) => {
    const prefixPath = React.useContext(MyFormItemContext);
    const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
    return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
  };
 
















  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };
  const onOk = (value) => {
    console.log('onOk: ', value);
  };
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
              <Typography.Title level={4}>Modifier Rendez-Vous</Typography.Title>
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
              <Form.Item name="nomPatient" label="Nom de patient"  rules={[
              { 
                
                required: true,
                message: 'Veuillez saisir le nom!',
              },
            ]}> 
                <Input type= 'text' />
              </Form.Item>
              <Form.Item name="medecin" label="medecin"  rules={[
              { 
                required: true,
                message: "Veuillez saisir le medecin!",
              },
            ]}> 
                <Input type="text" />
              </Form.Item>
              </div>
              <MyFormItemGroup>
              <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between"}}>
    
              <Form.Item 
            name="emailPatient"
            label="Email de patient"
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
            
            
            <Form.Item name="maladie" label="Maladie"  rules={[
              { 
                
                required: true,
                message: "Veuillez saisir la maladie!",
              },
            ]}>
              <Input type="text" />
              
            </Form.Item></div></MyFormItemGroup>
            </MyFormItemGroup>
           
          
            <Form.Item  name="dateRv" label="La date">
        <Space direction="vertical" size={24}>
          <DatePicker showTime onChange={onChange} onOk={onOk} />
        </Space>
      </Form.Item>
    
         
    
    
    
          </MyFormItemGroup>
          
          <Button  href="/rendezvous" danger type="text"  >Annuler</Button>             
          <Button type="primary" htmlType="submit">
            Enregistrer
          </Button>
          </Col></Row>
        </Form></motion.div>
       
      );
};
export default ModifierRv;