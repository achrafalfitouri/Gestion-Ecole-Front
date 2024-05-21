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
  IdcardOutlined,
  LogoutOutlined,
  MailOutlined,
  SnippetsOutlined,
  BookOutlined,
  BankOutlined
} from '@ant-design/icons';
import {  Space ,Popconfirm} from 'antd';
import { Button, Layout, Menu, theme,  Dropdown, Typography } from 'antd';
import { useState, useEffect, Children } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import './style.css';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Spin } from 'antd';
import Cookies from 'js-cookie';
import { lazy, Suspense } from "react";
import  { fetchUserData } from "../interceptors/axios"; // Import your custom Axios instance

const { Header, Sider, Content, Footer } = Layout;




const AppRoutes = lazy(() => import("../AppRoutes"));



const AppComponents = () => {
  const [logoText, setLogoText] = useState("EHPM");
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
    if (logoText === "EHPM") {
      setLogoText("EH");
    } else {
      const timer = setTimeout(() => {
        setLogoText("EHPM");
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
    const userDataFromLocalStorage = localStorage.getItem('user');
    if (token && userDataFromLocalStorage) {
      const userData = JSON.parse(userDataFromLocalStorage);
      setUser(userData);
      setUserRoles(userData.specialite);
      setIsLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const userData = await fetchUserData(); // Call fetchUserData from axios.js
          setUser(userData);
          setUserRoles(userData.specialite);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/login'); // Redirect to login page if there's an error fetching user data
        }
      };
  
      fetchData();
    }
  }, [navigate]);



  //logout button
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State to track hover state

  const hoverStyles = {
    fontSize: '18px',
    color: '#ce5254',
  };







// logout 
  const logout = async () => {
    try {
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
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
      label: "Etudiant",
      key: "/patient",
      icon: <UserAddOutlined />,
     
    },
    {
      label: "Formateur",
      key: "/formateur",
      icon: <UserAddOutlined />,
     
    },
    {
      label: "Inscription",
      key: "/patie",
      icon: <SnippetsOutlined/>,
    },
    {
      label: "Rendez-vous",
      key: "/rendezvous",
      icon: <CalendarOutlined />,
      
    },
    {
      label: "Facture",
      key: "/vita",
      icon: <IdcardOutlined />,
      hidden: !(userRoles.includes("Admin") || userRoles.includes("Medecin")) ,
    },
    {
      label: "Filliére",
      key: "/pharmaci",
      icon:<BookOutlined/>,
      hidden: !(userRoles.includes("Admin") || userRoles.includes("Medecin")),
      
    },
    {
      label: "Scolarite",
      key: "/pharmac",
      icon: <BankOutlined/>,
      hidden: !(userRoles.includes("Admin") || userRoles.includes("Medecin")),

      children: [
        {
          key: '11',
          label: 'Formateur par fillière',
        },
        {
          key: '12',
          label: 'Etudiant par fillière ',
        },
        {
          key: '12',
          label: 'Matière par filière ',
        },
        {
          key: '13',
          label: 'Planning',
        },
        {
          key: '14',
          label: 'Suivi de stage',
        },
      ],
    },
    
    {
      label: "Rapport de caisse",
      key: "/dossiersmedicau",
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
        <div style={{ padding: '16px',  display: 'flex', alignItems: 'center',textAlign : "center" }}>
         <LogoutOutlined  style={{
              color: 'white',
              fontSize: '16px',
              transition: 'font-size 0.3s, color 0.3s',
              margin : '8px',
              marginRight : '-4px',
              textAlign : "center",
              ...(isHovered && hoverStyles), // Apply hover styles when button is hovered
            }} />

        <Popconfirm
        
          title="Are you sure you want to logout?"
          onConfirm={logout}
          okText="Yes"
          cancelText="No"
          visible={confirmLogout}
          onCancel={() => setConfirmLogout(false)}
        >
          <Button
            type="text"
            onClick={() => setConfirmLogout(true)}
            style={{
              color: 'white',
              fontSize: '16px',
              transition: 'font-size 0.3s, color 0.3s',
            
              ...(isHovered && hoverStyles), // Apply hover styles when button is hovered
            }}
            onMouseEnter={() => setIsHovered(true)} // Set isHovered to true on mouse enter
            onMouseLeave={() => setIsHovered(false)} // Set isHovered to false on mouse leave
          >
                        <span style={{ visibility: collapsed ? 'hidden' : 'visible' }}>Deconnexion</span>

          </Button>
        </Popconfirm>
      </div>
          
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              borderRadius: '10px',
    border: '2px solid rgba(0, 0, 0, 0.1)', 
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
                borderRadius: '20px',
    border: '2px solid rgba(0, 0, 0, 0.1)', 
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
            <Typography.Title level={5}>EHPM ©2024</Typography.Title>
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default AppComponents;