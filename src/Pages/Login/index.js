import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Card, Row, Col } from 'antd';
import Cookies from 'js-cookie';



const { Item } = Form;

export const Login = () => {
  const [navigate, setNavigate] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const { data } = await axios.post('/api/auth/login', {
        Email: values.email,
        MotDePasse: values.password
      });

      // Set the token in cookies
      Cookies.set('token', data.token, { path: '/' });

      // Set the Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `${data.token}`;

      // Fetch user data and store it in local storage
      const userResponse = await axios.get('/api/auth/me');
      localStorage.setItem('user', JSON.stringify(userResponse.data));

      // Navigate to the home page
      setNavigate(true);
    } catch (error) {
      console.log(error);
      message.error('Invalid credentials', 3).style({ width: '300px' });
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
