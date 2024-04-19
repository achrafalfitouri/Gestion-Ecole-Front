import { Button, Form, Input,  Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
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



const VoirResultat = ({ initialValues, onSubmit }) => {
  const [, setExamenresultats] = useState([]);


  




  useEffect(() => {
    axios
      .get('/api/examenresultats')
      .then((response) => {
        setExamenresultats(response.data['hydra:member']);
        console.log(response.data['hydra:member']);
      
      })
      .catch((error) => {
        console.error('Error fetching medicaments:', error);
      });
  }, []);


  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Form name="form_item_path" layout="vertical" initialValues={initialValues} onFinish={onFinish}>
        <Typography.Title level={4}>Resultat</Typography.Title>
        
        <Row>
          <Col xs={{ span: 9, offset: 0 }}>
            
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <Form.Item   name="nomPatient" label="Nom du patient" >
              <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
            </Form.Item>
         
            <Form.Item name="maladie" label="Maladie" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
</Form.Item>



</div> 
             </MyFormItemGroup></Col></Row>

             <Row>
          <Col xs={{ span: 9, offset: 0 }}>
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <Form.Item name="nomTest" label="Nom de test">
        <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
</Form.Item>


<Form.Item name="patient" label="Numero de patient" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
</Form.Item>
</div> 
             </MyFormItemGroup></Col></Row>





        <Row>
          <Col xs={{ span: 9, offset: 15 }}>
            
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",marginTop: '-180px' }}>
            <Form.Item   name="nom" label="Nom de medecin" >
              <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
            </Form.Item>
         
            <Form.Item name="email" label="Email de medecin" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
</Form.Item>
      
</div> 

             </MyFormItemGroup></Col></Row>
        <Row>
          <Col xs={{ span: 9, offset: 15 }}>
            
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" ,marginTop: '-95px'   }}>
            <Form.Item   name="tel" label="Tel" >
              <Input  disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
            </Form.Item>
         
            <Form.Item name="adresse" label="Adresse" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black" }} />
</Form.Item>
      
</div> 

             </MyFormItemGroup></Col></Row>

             
             <Form.Item
            
            name="description"
            label="Description"
          
          >
            <Input.TextArea disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
          </Form.Item>


            <Button href="/examen" danger type="text">
              Annuler
            </Button>
           
          
      </Form>
    </motion.div>
  );
};

export default VoirResultat;
