import { Button,  Col, Form, Input, Row, Select, Typography} from 'antd';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import axios from 'axios';

const { TextArea } = Input;
const MyFormItemContext = React.createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};



const AjouterResultat = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    description: '',
    nomTest: '',
    maladie: '',
  });
  const [examentests, setExamentests] = useState([]);
  const [selectedExamentest, setSelectedExamentest] = useState(null);
  const [form] = Form.useForm();
  const [, setPostedData] = useState([]);

  useEffect(() => {
    const fetchTests = () => {
      const params = {
        
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/examentests?pagination=true", { params })
        .then((response) => {
          setExamentests(response.data['hydra:member']);
         
        })
        .catch((error) => {
          console.error("Error fetching data from API:", error);
         
        });
    };
  
    
    fetchTests();
  }, []);

  const handleSelectChange = (value) => {
    const selectedExamentestData = examentests.find((examentest) => examentest.id === value);
    setSelectedExamentest(selectedExamentestData);
    
    if (selectedExamentestData) {
      form.setFieldsValue({
        nomTest: selectedExamentestData.nomTest,
        maladie: selectedExamentestData.maladie,
      });
    }
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
          const patientId = selectedExamentest.patient.split("/").pop();

          const postData = {
            ...formData,
            createdAt: new Date().toISOString(),
            user: userData && userData.id ? `api/users/${userData.id}` : null,
            nomTest: selectedExamentest ? selectedExamentest.nomTest : '',
            maladie: selectedExamentest ? selectedExamentest.maladie : '',
            nomPatient: selectedExamentest ? selectedExamentest.nomPatient : '',
            examentest: selectedExamentest ? `api/examentests/${selectedExamentest.id}` : null,
            patient: selectedExamentest ? `api/patients/${patientId}` : null,
          };

          axios
            .post('/api/examenresultats', postData)
            .then((response) => {
              console.log(response.data);
              console.log('User ID:', userData && userData.id);
              setPostedData((prevData) => [...prevData, response.data]); 
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
        <Typography.Title level={4}>Ajouter une resultat</Typography.Title>
        <Row>
          <Col xs={{ span: 9, offset: 7 }}>
            <MyFormItemGroup prefix={['user']}>
              <MyFormItemGroup prefix={['name']}>
             

                <MyFormItemGroup>
                  <Form.Item label="Selectionner un patient">
                    <Select
                      showSearch
                      placeholder="Rechercher un patient"
                      optionFilterProp="children"
                      onChange={handleSelectChange}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={examentests.map((examentests) => ({
                        value: examentests.id,
                        label: examentests.nomPatient,
                        key: examentests.id,
                      }))}
                    />
                  </Form.Item>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Form.Item
                    
                      name="maladie"
                      label="Maladie"
                      rules={[{ required: true, message: 'Veuillez saisir le nom de la maladie!' }]}
                    >
                      <Input disabled
                      style={{color: 'black'}}
                        defaultValue={formData.maladie}
                        onChange={(e) => handleInputChange('maladie', e.target.value)}
                        type="text"
                      />
                    </Form.Item>
                    <Form.Item
                    
                      name="nomTest"
                      label="Nom de test"
                      rules={[{ required: true, message: 'Veuillez saisir le nom du test!' }]}
                    >
                      <Input disabled
                      style={{color: 'black'}}
                        value={formData.nomTest}
                        onChange={(e) => handleInputChange('nomTest', e.target.value)}
                        type="text"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Veuillez saisir une description!' }]}
                  >
                    <TextArea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </Form.Item>
                </MyFormItemGroup>
              </MyFormItemGroup>
            </MyFormItemGroup>
            
            <Form.Item>
            <Button danger type="text" href="/examen">
              Annuler
            </Button>
              <Button type="primary" htmlType="submit" onClick={handlePost}>
                Ajouter
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </motion.div>
  );
};

export default AjouterResultat;
