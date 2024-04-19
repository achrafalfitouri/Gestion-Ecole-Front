import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Card, Row, Col } from 'antd';

const { Item } = Form;

export const Login = () => {
  const [navigate, setNavigate] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const { data } = await axios.post('/authentication_token', {
        email: values.email,
        password: values.password
      }, { withCredentials: true });

   
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `refresh_token=${data.refresh_token}; path=/`;
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      setNavigate(true);
    } catch (error) {
      console.log(error);
      message.error('Invalid credentials', /* duration */ 3).style({ width: '300px' });
    }
  };

  if (navigate) {
    return <Navigate to="/" />;
  }

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={{ span: 6, offset: 0 }}>
        <div className="dark-theme-container" style={{ marginTop: '-100px' }}>
          <Card title="Bonjour , Veuillez faire la conexion" className="form-card">
            <Form form={form} onFinish={onFinish}>
              <Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez saisir votre email!',
                  },
                ]}
                style={{ width: '100%' }}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
              </Item>

              <Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Veuillez saisir votre mot de passe!',
                  },
                ]}
                style={{ width: '100%' }}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Mot de passe "
                />
              </Item>

              <Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Enregistrer </Checkbox>
                </Form.Item>
              </Item>

              <Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  conexion
                </Button>
              </Item>
            </Form>
          </Card>
        </div>
      </Col>
    </Row>
  );
};
