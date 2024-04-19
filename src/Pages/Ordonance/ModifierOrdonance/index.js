import { Button, Form, Input, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import axios from 'axios';


const ModifierOrdonance = ({ initialValues, onSubmit, onMedicamentNamesChange }) => {
  const [medicaments, setMedicaments] = useState([]);
 
  const [formValues, setFormValues] = useState(initialValues);
  const [selectedOptionNames, setSelectedOptionNames] = useState([]);



  const handleSubmit = () => {
    onSubmit(formValues, selectedOptionNames);
  };


  useEffect(() => {
    axios
      .get('/api/medicaments')
      .then((response) => {
        setMedicaments(response.data['hydra:member']);
        console.log(response.data['hydra:member']);
      })
      .catch((error) => {
        console.error('Error fetching medicaments:', error);
      });
  }, []);

 const handleSelectChange = (selectedOptionNames) => {
    setSelectedOptionNames(selectedOptionNames);
    setFormValues({ ...formValues, nomMedicament: selectedOptionNames });
    onMedicamentNamesChange(selectedOptionNames);
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
        <Typography.Title level={4}>Modifier l'ordonnance</Typography.Title>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <Form.Item name="nomPatient" label="Nom du patient" rules={[{ required: true, message: 'Veuillez saisir le nom de patient!' }]}>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="maladie" label="Maladie" rules={[{ required: true, message: "Veuillez saisir la maladie!" }]}>
              <Input type="text" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  message: "Veuillez saisir la decription!",
                },
                {
                  required: true,
                  message: "Veuillez saisir la decription!",
                },
              ]}
            >
              <Input.TextArea type="text" />
            </Form.Item>
            <Form.Item name="nomMedicament" label="Sélectionner un médicament">
              <Select
                mode="multiple"
                placeholder="Rechercher un médicament"
                onChange={handleSelectChange}
                value={selectedOptionNames}
                options={medicaments.map((medicament) => ({
                  value: medicament.nom,
                  label: medicament.nom,
                }))}
              />
            </Form.Item>
            <Button href="/ordonance" danger type="text">
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

export default ModifierOrdonance;
