import {
  MenuFoldOutlined,
 
  UserOutlined,

  CalendarOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  PlusSquareOutlined,
  DiffOutlined,
  DashboardOutlined,
 
  UserAddOutlined,
  MenuUnfoldOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import {  Space } from 'antd';
import { Button, Layout, Menu, theme,  Dropdown, Typography } from 'antd';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import './style.css';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Spin } from 'antd';
import Cookies from 'js-cookie';
import { lazy, Suspense } from "react";

const { Header, Sider, Content, Footer } = Layout;




const AppRoutes = lazy(() => import("../AppRoutes"));



const AppComponents = () => {
  const [logoText, setLogoText] = useState("Cabinet Medical");
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
//pour changer le text de logo 
  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);
  const navigate = useNavigate();
  const handleButtonClick = () => {
    if (logoText === "Cabinet Medical") {
      setLogoText("CM");
    } else {
      const timer = setTimeout(() => {
        setLogoText("Cabinet Medical");
      }, 230);

      return () => {
        clearTimeout(timer);
      };
    }
  };

  //user_id && data
  const [user, setUser] = useState(null);
  const [navigate1, setNavigate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("/api/user/me", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          setUser(userData);
          setUserRoles(userData.specialite)
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setNavigate(true);
        }
      };

      fetchUserData();
    } else {
      setNavigate(true);
    }
  }, []);






// logout 
  const logout = async () => {
    try {
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      await axios.post("logout", {}, { withCredentials: true });
      
      navigate('/login');
      setNavigate(true);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  
  if (navigate1) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const items = [
   
    {
      label: 'Deconnexion',
      key: '2',
      danger: true,
      onClick: logout,
    },
  ];

  const menuProps = {
    items,
  };


  const filteredItems = [
    {
      label: "Tableau de bord",
      icon: <DashboardOutlined />,
      key: "/",
    },
    {
      label: "Utilisateur",
      key: "/utilisateur",
      icon: <UserOutlined />,
      hidden: !userRoles.includes("Admin"),
    },
    {
      label: "Patient",
      key: "/patient",
      icon: <UserAddOutlined />,
     
    },
    {
      label: "Rendez-vous",
      key: "/rendezvous",
      icon: <CalendarOutlined />,
      
    },
    {
      label: "Vital",
      key: "/vital",
      icon: <IdcardOutlined />,
      hidden: !(userRoles.includes("Admin") || userRoles.includes("Medecin")) ,
    },
    {
      label: "Pharmacie",
      key: "/pharmacie",
      icon: <PlusSquareOutlined />,
      hidden: !(userRoles.includes("Admin") || userRoles.includes("Medecin")),
    },
    {
      label: "Examen",
      key: "/examen",
      icon: <ExperimentOutlined />,
      hidden: !(userRoles.includes("Admin") || userRoles.includes("Medecin")),
    },
    {
      label: "Ordonance",
      key: "/ordonance",
      icon: <DiffOutlined />,
      hidden: !(userRoles.includes("Admin") || userRoles.includes("Medecin")),
    },
    {
      label: "Dossier Medicaux",
      key: "/dossiersmedicaux",
      icon: <FileTextOutlined />,
      hidden: !(userRoles.includes("Admin") || userRoles.includes("Medecin")) ,
    },
  ];
  
  const filteredMenuItems = filteredItems.filter((item) => !item.hidden);
  
  // ...
  

  
 
  
  return (
    <div className="App">
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="60"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="demo-logo-vertical" />
          <div
            style={{
              textAlign: "center",
              padding: "16px",
              color: "white",
              fontSize: '20px',
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "bold",
          
            }}
          >
            {logoText}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            onClick={(item) => {
              navigate(item.key);
            }}
            selectedKeys={[selectedKeys]}
            items={filteredMenuItems}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                setCollapsed(!collapsed);
                handleButtonClick();
              }}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />

            <Row>
              <Col
                xs={{
                  span: 9,
                  offset: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-50px" }}>
                  <Space wrap>
                    <Dropdown.Button menu={menuProps} placement="bottom" icon={<UserOutlined />}>
                    {user.nom}
                    </Dropdown.Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </Header>
          <motion.div
            initial={{ opacity: 0, translateX: -10, translateY: -10 }}
            animate={{ opacity: 1, translateY: -10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                height: '100%',
                minHeight: 280,
                background: colorBgContainer,
                overflow: 'auto',
                flex: 1,
                animation: 'fadeIn 0.5s ease-in-out',
              }}
            >
              <Suspense fallback={<div>Loading...</div>}>
              <AppRoutes /></Suspense>
            </Content>
          </motion.div>
          <Footer
            style={{
              textAlign: 'center',
              margin: 10,
              padding: 10,
            }}
          >
            <Typography.Title level={5}>Norsys Stage Cabinet Medical ©2023 Created by Alfitouri Achraf & Liqali Issam</Typography.Title>
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default AppComponents;