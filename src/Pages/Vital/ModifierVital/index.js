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

const ModifierVital = ({ initialValues, onSubmit }) => {

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
        <Typography.Title level={4}>Modifier vital</Typography.Title>
        <Row>
        <Col xs={{ span: 20, offset: 4 }}>
          <MyFormItemGroup prefix={['user']}>
            <MyFormItemGroup prefix={['name']}>
              <MyFormItemGroup>
                <div style={{ display: "flex", alignItems: "flew-end", justifyContent: "space-between"  }}>
                <Form.Item
                    name="nomPatient"
                    label="Nom de patient"
                    
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input
                     disabled
                      type="text"
                    />
                  </Form.Item>
                  <Form.Item name="assurance" label="Assurance" style={{ width: "100%" , marginRight: "10px"}}>
                    <Select
                      
                      placeholder="Veuillez sélectionner Assurance!"
                    >
                      <Option value="AMO">Assurance maladie obligatoire</Option>
                      <Option value="AMC">Assurance maladie complémentaire</Option>
                      <Option value="AMP">Assurance maladie privée</Option>
                      <Option value="AMF">Assurance maladie pour les fonctionnaires</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="nemuroAssurance"
                    label="Némuro Assurance"
                    rules={[{ required: true, message: "Veuillez saisir Némuro Assurance!" }]}
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input
                      
                      type="number"
                    />
                  </Form.Item>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Form.Item name="allergies" label="Allergie" style={{ width: "100%" , marginRight: "10px"}}>
                    <Select
                    
                      placeholder="allergies oui ou non!"
                    >
                      <Option value="oui">Oui</Option>
                      <Option value="non">Non</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="tensionArtetielle"
                    label="Tension Artetielle"
                    rules={[{ message: "Veuillez saisir Tension !" }]}
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input
                      suffix='mmHg'
                      type="text"
                    />
                  </Form.Item>
                  <Form.Item
                    name="frequenceCardiaque"
                    label="Frequence Cardiaque"
                    rules={[{ message: "Saisir Frequence Cardiaque!" }]}
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input
                      suffix="bpm" 
                      type="number"
                    />
                  </Form.Item>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Form.Item
                    name="groupeSanguin"
                    label="Groupe Sanguin"
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Select
                 
                      placeholder="Veuillez selectioner groupe sanguin!"
                    >
                      <Option value="AB+">AB+</Option>
                      <Option value="AB-">AB-</Option>
                      <Option value="A+">A+</Option>
                      <Option value="A-">A-</Option>
                      <Option value="B+">B+</Option>
                      <Option value="B-">B-</Option>
                      <Option value="O+">O+</Option>
                      <Option value="O-">O-</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
              name="poids"
               label="Poids"
                rules={[{ required: true, message: "Veuillez saisir Poids !" }]}
                 style={{ width: "100%", marginRight: "10px" }}
                    >
           <Input suffix="kg" type="number"  />
                </Form.Item>

                  <Form.Item
                    name="taille"
                    label="Taille"
                    rules={[{ required: true, message: "Veuillez saisir Taille !" }]}
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input suffix="cm"  type="number" />
                  </Form.Item>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Form.Item
                    name="antecedentsMedicaux"
                    label="Antecedents Medicaux"
                    rules={[{ message: "Veuillez saisir Antecedents Medicaux!" }]}
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input
                      
                      type="text"
                    />
                  </Form.Item>
                  <Form.Item
                    name="medicamentActuel"
                    label="Medicament Actuel"
                    rules={[{ message: "Veuillez saisir Medicament Actuel!" }]}
                    style={{ width: "100%" , marginRight: "10px" }}
                  >
                    <Input
                      
                      type="text"
                    />
                  </Form.Item>
                  <Form.Item
                    name="antecedentsFamiliaux"
                    label="Antecedents Familiaux"
                    rules={[{ message: "Veuillez saisir !" }]}
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input
                     
                      type="text"
                    />
                  </Form.Item>
                </div>
              </MyFormItemGroup>
            </MyFormItemGroup>
          </MyFormItemGroup>
          <Button danger type="text" href="/vital">
            Annuler
          </Button>
          <Button type="primary" htmlType="submit" >
            Enregistrer
          </Button>
        </Col>
      </Row>
  </Form></motion.div>
 
);
};
export default ModifierVital ;