import {

  CalendarOutlined,
  UserAddOutlined,
  FileTextOutlined,
  DiffOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import {
  Card,
  Space,
  Statistic,
  Table,
  Typography,
  Badge,
  Calendar,
  
  Button,
  Modal,
  Col,
  Row,
} from 'antd';
import { Progress} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { motion } from 'framer-motion';
import "./style.css"

function Dashboard() {
  // les données des patients
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios
      .get('/api/patients')
      .then((response) => {
        const resultatData = response.data['hydra:member'];
        const count = resultatData.length;
        setPatientCount(count);
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  };

  // les données des ordonances
  const [ordonanceCount, setOrdonanceCount] = useState(0);

  useEffect(() => {
    fetchOrdonance();
  }, []);

  const fetchOrdonance = () => {
    axios
      .get('/api/ordonances')
      .then((response) => {
        const ordonanceData = response.data['hydra:member'];
        const count = ordonanceData.length;
        setOrdonanceCount(count);
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  };

  // les données des rendez-vous
  const [rendezvousCount, setRendezvousCount] = useState(0);

  useEffect(() => {
    fetchRendezvous();
  }, []);

  const fetchRendezvous = () => {
    axios
      .get('/api/rendezvouses')
      .then((response) => {
        const rendezvousData = response.data['hydra:member'];
        const count = rendezvousData.length;
        setRendezvousCount(count);
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  };

  // les données des examentests

  const [examentestCount, setExamentestCount] = useState(0);

  useEffect(() => {
    fetchExamentest();
  }, []);

  const fetchExamentest = () => {
    axios
      .get('/api/examentests')
      .then((response) => {
        const examentestData = response.data['hydra:member'];
        const count = examentestData.length;
        setExamentestCount(count);
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  };

  // les données des examenresultasts

  const [examenresultatCount, setExamenresultatCount] = useState(0);

  useEffect(() => {
    fetchExamenresultat();
  }, []);

  const fetchExamenresultat = () => {
    axios
      .get('/api/examenresultats')
      .then((response) => {
        const examenresultatData = response.data['hydra:member'];
        const count = examenresultatData.length;
        setExamenresultatCount(count);
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  };

  //affichage

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -10, translateY: -10 }}
      animate={{ opacity: 1, translateY: -10 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Space size={20} direction='vertical'>
        <Typography.Title level={4}>Tableau de bord</Typography.Title>
        <Space direction='horizontal'>
          <Row>
            <Col xs={{ span: 5, offset: 1 }}>
              <DashboardCard
                icon={
                  <FileTextOutlined
                    style={{
                      color: 'green',
                      backgroundColor: 'rgba(0,255,0,0.25)',
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={'Examen tests'}
                value={examentestCount}
              />
              <DashboardCard
                icon={
                  <UserAddOutlined
                    style={{
                      color: 'blue',
                      backgroundColor: 'rgba(0,0,255,0.25)',
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={'Patient'}
                value={patientCount}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 5, offset: 1 }}>
              <DashboardCard
                icon={
                  <FileTextOutlined
                    style={{
                      color: 'green',
                      backgroundColor: 'rgba(0,255,0,0.25)',
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={'Examen resultats'}
                value={examenresultatCount}
              />
              <DashboardCard
                icon={
                  <DiffOutlined
                    style={{
                      color: 'blue',
                      backgroundColor: 'rgba(0,0,255,0.25)',
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={'Ordonances'}
                value={ordonanceCount}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 5, offset: 1 }}>
              <DashboardCard
                icon={
                  <FolderOpenOutlined
                    style={{
                      color: 'green',
                      backgroundColor: 'rgba(0,255,0,0.25)',
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={'Dossiers Medicaux'}
                value={patientCount}
              />
              <DashboardCard
                icon={
                  <CalendarOutlined
                    style={{
                      color: 'blue',
                      backgroundColor: 'rgba(0,0,255,0.25)',
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={'Rendez-Vous'}
                value={rendezvousCount}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 18, offset: 4 }}>
              <DashboardChart />
            </Col>
          </Row>
        </Space>
        
          <Row>
            <DerniersRv />
          
           
              <div className='calendar'>
              <DashboardCalendar /> 
              </div>
          </Row>
       
      </Space>
    </motion.div>
  );
}

// le composant de carte
function DashboardCard({ title, value, icon }) {
  return (
    <Card style={{ height: '160px', width: '220px' }}>
      <Space direction='horizontal'>
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

// le composant des derniers rendez-vous
function DerniersRv() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage] = useState(1);
  const [pageSize] = useState(5);
  const [, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchRendezvouss = () => {
      const params = {
        page: currentPage,
        itemsPerPage: 3,
       
        'order[created_at]': 'DESC'
      };
  
      axios
        .get("/api/rendezvouses?pagination=true", { params })
        .then((response) => {
          setDataSource(response.data['hydra:member']);
          setTotalItems(response.data['hydra:totalItems']);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données depuis l'API :", error);
          setLoading(false);
        });
    };
  
    setLoading(true);
    fetchRendezvouss();
  }, [currentPage, pageSize]);

  const columns = [
    
    { title: 'Nom de patient',dataIndex: 'nomPatient', key: 'nomPatient',width: '30%',},

    { title: 'Email de patient',dataIndex: 'emailPatient',key: 'emailPatient',width: '30%',},

    { title: 'Maladie', dataIndex: 'maladie', key: 'maladie', width: '30%' },

    { title: 'Medecin', dataIndex: 'medecin', key: 'medecin', width: '30%' },

    { title: 'Date de rendez-vous',dataIndex: 'dateRv',key: 'dateRv',width: '30%',render: (dateRv) => moment(dateRv).format('YYYY-MM-DD HH:mm:ss'), },
  
  ];

  return (
    <Card title='Les derniers rendez-vous'>
    <Row>
      <Col
        xs={{
          span: 5,
          offset: 1,
        }}
      >
        
        <>
         
          <Table
            columns={columns}
            loading={loading}
            dataSource={dataSource}
            pagination={false}
            size='small'
          ></Table>
        </>
      </Col>
    </Row></Card>
  );
}


//le composant de calendrier
const DashboardCalendar = () => {
  const [isvisible, setVisible] = useState(false); // State for controlling the visibility of the pop-up
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    fetchRendezvousData();
  }, []);

  const fetchRendezvousData = () => {
    axios
      .get('/api/rendezvouses')
      .then((response) => {
        const rendezvousData = response.data['hydra:member'];
        const events = rendezvousData.map((rendezvous) => ({
          date: moment(rendezvous.dateRv).format('YYYY-MM-DD'),
          title: rendezvous.nomPatient,
          rendezvousDate: rendezvous.dateRv,
        }));
        setEventsData(events);
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  };

  const dateCellRender = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const events = eventsData.filter((event) => event.date === formattedDate);
    const isPastDate = moment(date).isBefore(moment(), 'day'); 
    const cellClass = isPastDate ? 'disabled-cell' : '';

    return (
      <div className={`events ${cellClass}`}>
        {events.map((event, index) => (
          <div key={index}>
            <Badge
              status='success'
              text={`${event.title} - ${moment(event.rendezvousDate).format(
                'HH:mm:ss'
              )}`}
            />
          </div>
        ))}
      </div>
    );
  };

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        size='large'
        onClick={handleOpenModal}
        icon={<CalendarOutlined />}
        style={{marginBottom: '275px',  marginLeft: '0cm' }}
      >
        Ouvrir le calendrier
      </Button>
      <Modal
        title='Calendrier'
        open={isvisible}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
      >
        <Calendar dateCellRender={dateCellRender} />
       
      </Modal>
    
    </>
  );
};

const DashboardChart = () => {
  const [, setPatientCount] = useState(0);
  const [, setExamenresultatCount] = useState(0);
  const [, setExamentestCount] = useState(0);
  const [, setOrdonanceCount] = useState(0);
  const [, setRendezvousCount] = useState(0);
  const [, setTotalCount] = useState(0);
  const [percent, setPercent] = useState(0);
  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);
  const [percent3, setPercent3] = useState(0);
  const [percent4, setPercent4] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const rendezvousPromise = axios.get(
      '/api/rendezvouses'
    );
    const patientPromise = axios.get('/api/patients');
    const ordonancePromise = axios.get('/api/ordonances');
    const examentestPromise = axios.get(
      '/api/examentests'
    );
    const examenresultatPromise = axios.get(
      '/api/examenresultats'
    );

    Promise.all([
      rendezvousPromise,
      patientPromise,
      ordonancePromise,
      examentestPromise,
      examenresultatPromise,
    ])
      .then((responses) => {
        const rendezvousData = responses[0].data['hydra:member'];
        const patientData = responses[1].data['hydra:member'];
        const ordonanceData = responses[2].data['hydra:member'];
        const examentestData = responses[3].data['hydra:member'];
        const examenresultatData = responses[4].data['hydra:member'];

        setRendezvousCount(rendezvousData.length);
        setPatientCount(patientData.length);
        setOrdonanceCount(ordonanceData.length);
        setExamentestCount(examentestData.length);
        setExamenresultatCount(examenresultatData.length);

        const total = rendezvousData.length;
        setTotalCount(total);

        const calculatedPercent =  ( patientData.length / patientData.length)* 100
        const calculatedPercent1 = (rendezvousData.length / patientData.length ) * 100;
        const calculatedPercent2 = (ordonanceData.length / total) * 100;
        const calculatedPercent3 = (examentestData.length / total) * 100;
        const calculatedPercent4 = (examenresultatData.length / total) * 100;
        setPercent(calculatedPercent);
        setPercent1(calculatedPercent1);
        setPercent2(calculatedPercent2);
        setPercent3(calculatedPercent3);
        setPercent4(calculatedPercent4);
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  };

  return (
    <>
      <Row>
        <Col xs={{ span: 5, offset: 1 }}>
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            className='progress-group'
          >
            <div style={{ marginRight: '20px' }}>
              <h5>Patients</h5>
              <Space wrap>
                <Progress
                  type='circle'
                  percent={percent}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Space>
            </div>
            <div style={{ marginRight: '20px' }}>
              <h5>Rendez-vous</h5>
              <Space wrap>
                <Progress
                  type='circle'
                  percent={percent1}
                  format={() => `${Math.round(percent1)}%`}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Space>
            </div>
            <div style={{ marginRight: '20px' }}>
              <h5>Rendez-vous consulté</h5>
              <Space wrap>
                <Progress
                  type='circle'
                  percent={percent2}
                  format={() => `${Math.round(percent2)}%`}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Space>
            </div>
          </div>
        </Col>
      </Row>
      <div
        style={{ display: 'flex', alignItems: 'center' }}
        className='progress-group'
      >
        <div style={{ marginRight: '20px' }}>
          <h5>Examen tests</h5>
          <Space wrap>
            <Progress
              type='circle'
              percent={percent3}
              format={() => `${Math.round(percent3) !== null ? Math.round(percent3) + '%' : '0%'}`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Space>
        </div>
        <div style={{ marginRight: '20px' }}>
          <h5>Examen resultats</h5>
          <Space wrap>
            <Progress
              type='circle'
              percent={percent4}
              format={() => `${Math.round(percent4)}%`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Space>
        </div>
        <div style={{ marginRight: '20px' }}>
          <h5>Dossiers medicaux</h5>
          <Space wrap>
            <Progress
              type='circle'
              percent={percent1}
              format={() => `${Math.round(percent1)}%`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Space>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
