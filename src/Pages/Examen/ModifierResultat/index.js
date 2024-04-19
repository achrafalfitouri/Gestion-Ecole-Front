import { Button, Form, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';


const ModifierResultat = ({ initialValues, onSubmit }) => {


  const [formValues, ] = useState(initialValues);
  const [selectedOptionNames,] = useState([]);



  const handleSubmit = () => {
    onSubmit(formValues, selectedOptionNames);
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
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Form name="form_item_path" layout="vertical" initialValues={initialValues} onFinish={onFinish}>
        <Typography.Title level={4}>Modifier la resultat</Typography.Title>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <Form.Item name="nomPatient" label="Nom du patient" rules={[{ required: true, message: 'Veuillez saisir le nom de patient!' }]}>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="nomTest" label="Nom de test" rules={[{ required: true, message: 'Veuillez saisir le nom de test!' }]}>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="maladie" label="Maladie" rules={[{ required: true, message: "Veuillez saisir l'adresse!" }]}>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: "Veuillez saisir la description!" }]}>
              <Input.TextArea type="text" />
            </Form.Item>

           
        
            <Button href="/examen" danger type="text">
              Annuler
            </Button>
            <Button onClick={handleSubmit} type="primary" htmlType="submit">
              Enregistrer
            </Button>
          </Col>
        </Row>
      </Form>
    </motion.div>
  );
};

export default ModifierResultat;
