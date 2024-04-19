import { Button, Col, Form, Input,  Row, Select, Typography,  } from 'antd';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import axios from 'axios';
import InputMask from 'react-input-mask';

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



const AjouterVital = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nomPatient: '',
    assurance: '',
    allergies: '',
    poids: '',
    taille: '',
    antecedentsMedicaux: '',
    medicamentActuel: '',
    nemuroAssurance: '',
    groupeSanguin: '',
    tensionArtetielle: '',
    frequenceCardiaque: '',
    antecedentsFamiliaux: '',
    
  });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPatients = () => {
      const params = {
       
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/patients?pagination=true", { params })
        .then((response) => {
          setPatients(response.data['hydra:member']);
          
        })
        .catch((error) => {
          console.error("Error fetching data from API:", error);
         
        });
    };
  
    fetchPatients();
  }, []);
  

  const handleSelectChange = (value, option) => {
    const selectedPatientData = patients.find((patient) => patient.id === value);
    setSelectedPatient(selectedPatientData);
    
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
            nomPatient: selectedPatient ? selectedPatient.nom : '',
            
            patient: selectedPatient ? `api/patients/${selectedPatient.id }` : null,

          };

          console.log(postData);

          axios
            .post('/api/vitals', postData)
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
      <Typography.Title level={4}>Ajouter un Vital</Typography.Title>
      <Row>
        <Col xs={{ span: 20, offset: 4 }}>
          <MyFormItemGroup prefix={['user']}>
            <MyFormItemGroup prefix={['name']}>
              <MyFormItemGroup>
                <div style={{ display: "flex", alignItems: "flew-end", justifyContent: "space-between"  }}>
                  <Form.Item label="Selectionner un patient" style={{ width: "100%" , marginRight: "10px"}}>
                    <Select
                      showSearch
                      placeholder="Rechercher un patient"
                      optionFilterProp="children"
                      onChange={handleSelectChange}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={patients.map((patient) => ({
                        value: patient.id,
                        label: patient.nom,
                        key: patient.id,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item name="assurance" label="Assurance" style={{ width: "100%" , marginRight: "10px"}}>
                    <Select
                      value={formData.assurance}
                      onChange={(value) => handleInputChange('assurance', value)}
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
                      value={formData.nemuroAssurance}
                      onChange={(e) => handleInputChange('nemuroAssurance', e.target.value)}
                      type="number"
                    />
                  </Form.Item>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Form.Item name="allergies" label="Allergie" style={{ width: "100%" , marginRight: "10px"}}>
                    <Select
                      value={formData.allergies}
                      onChange={(value) => handleInputChange('allergies', value)}
                      placeholder="allergies oui ou non!"
                    >
                      <Option value="oui">Oui</Option>
                      <Option value="non">Non</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
          name="tensionArtetielle"
  label="Tension Artetielle"
  rules={[{ message: "Veuillez saisir la tension !" }]}
  style={{ width: "100%", marginRight: "10px" }}
>
  <InputMask
    mask="999/999"
    maskChar={null}
    value={formData.tensionArtetielle}
    onChange={(e) => handleInputChange('tensionArtetielle', e.target.value)}
  >
    {(inputProps) => (
      <Input
        {...inputProps}
        type="text"
        suffix="mmHg"
      />
    )}
             </InputMask>
   </Form.Item>

                  <Form.Item
                    name="frequenceCardiaque"
                    label="Frequence Cardiaque"
                    rules={[{ message: "Saisir Frequence Cardiaque!" }]}
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input
                      value={formData.frequenceCardiaque}
                      onChange={(e) => handleInputChange('frequenceCardiaque', e.target.value)}
                      type="number"
                      suffix="bpm"
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
                      value={formData.groupeSanguin}
                      onChange={(value) => handleInputChange('groupeSanguin', value)}
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
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input suffix="kg" value={formData.poids} onChange={(e) => handleInputChange('poids', e.target.value)} type="number" />
                  </Form.Item>
                  <Form.Item
                    name="taille"
                    label="Taille"
                    rules={[{ required: true, message: "Veuillez saisir Taille !" }]}
                    style={{ width: "100%" , marginRight: "10px"}}
                  >
                    <Input suffix="cm" value={formData.taille} onChange={(e) => handleInputChange('taille', e.target.value)} type="number" />
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
                      value={formData.antecedentsMedicaux}
                      onChange={(e) => handleInputChange('antecedentsMedicaux', e.target.value)}
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
                      value={formData.medicamentActuel}
                      onChange={(e) => handleInputChange('medicamentActuel', e.target.value)}
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
                      value={formData.antecedentsFamiliaux}
                      onChange={(e) => handleInputChange('antecedentsFamiliaux', e.target.value)}
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
          <Button type="primary" htmlType="submit" onClick={handlePost}>
            Ajouter
          </Button>
        </Col>
      </Row>
    </Form>
  </motion.div>
  
  );
};

export default AjouterVital;
