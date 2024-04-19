import { Button, Form, Input, Typography } from 'antd';
import {  Table } from "antd";
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import moment from 'moment';
import html2canvas from 'html2canvas';


const MyFormItemContext = React.createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};



const AfficherDossier = ({ patient, initialValues, onSubmit, examenTests, examenResultats ,user}) => {
    console.log(user)
    const [currentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalItems] = useState(0);
 

 
  const downloadPDF = () => {
    const capture = document.querySelector('.pdf');
    setLoader(true);
  
    const dpi = 300;
    const quality = 1.0; 
  
    const scale = dpi / 96; 
  
    const options = {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: true
    };
  
    html2canvas(capture, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', quality);
      const doc = new jsPDF('p', 'mm', 'a4');
  
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imageWidth = canvas.width / dpi * 25.4; 
      const imageHeight = canvas.height / dpi * 25.4; 
  
      const aspectRatio = imageWidth / imageHeight;
      let targetWidth = pageWidth;
      let targetHeight = targetWidth / aspectRatio;
  
      if (targetHeight > pageHeight) {
        targetHeight = pageHeight;
        targetWidth = targetHeight * aspectRatio;
      }
  
      const x = (pageWidth - targetWidth) / 2;
      const y = (pageHeight - targetHeight) / 2;
  
      doc.addImage(imgData, 'PNG', x, y, targetWidth, targetHeight);
      setLoader(false);
      doc.save('pdf');
    });
  };
  
  


   const [loader, setLoader]= useState(false) ;


  const [loading] = useState(false);

  const columns = [
  
    { title: "Nom de patient", dataIndex: "nomPatient", key: "nomPatient", width: '30%' },
    { title: "Maladie", dataIndex: "maladie", key: "maladie", width: '30%' },
    { title: "Nom de Medicament", dataIndex: "nomMedicament", key: "nomMedicament", width: '30%' },
    { title: "description", dataIndex: "description", key: "description", width: '30%' },
   
  ];
  const columns1 = [
  
    { title: "Nom de patient", dataIndex: "nomPatient", key: "nomPatient", width: '30%' },
    { title: "Maladie", dataIndex: "maladie", key: "maladie", width: '30%' },
    { title: "Nom de test", dataIndex: "nomTest", key: "nomTest", width: '30%' },
    { title: "date de test", dataIndex: "dateTest", key: "dateTest", width: '30%',
    render: (dateTest) => moment(dateTest).format('YYYY-MM-DD HH:mm:ss')
  },
   
  ];
  const columns2 = [
  
    { title: "Nom de patient", dataIndex: "nomPatient", key: "nomPatient", width: '30%' },
    { title: "Maladie", dataIndex: "maladie", key: "maladie", width: '30%' },
    { title: "Nom de test", dataIndex: "nomTest", key: "nomTest", width: '30%' },
      { title: "description", dataIndex: "description", key: "description", width: '30%' },
   
  ];



  const [form] = Form.useForm();

 
  useEffect(() => {
    form.setFieldsValue(patient);
  }, [form, patient]);
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
      
<Form form={form}  name="form_item_path" layout="vertical" initialValues={initialValues}  onFinish={onFinish}>
<div className='pdf' style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>

          <Typography.Title level={2}>Dossier medical</Typography.Title>
        
        <Row>
          <Col xs={{ span: 9, offset: 0 }}>
            
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" ,background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',
                width: '600px'}}>
        <Form.Item name="patient" label="Numero de dossier">
        <Input  disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black"  }} />
</Form.Item>


<Form.Item name="cin" label="CIN" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black"  }} />
</Form.Item>
</div> 

             </MyFormItemGroup></Col></Row>

             <Row>
          <Col xs={{ span: 9, offset: 0 }}>
        <MyFormItemGroup>
     


<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" ,background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',
                width: '600px'}}>
            <Form.Item   name="nom" label="Nom de patient" >
              <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black"  }} />
            </Form.Item>
         
            <Form.Item name="nemuroAssurance" label="Nemuro d'assurance" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black"  }} />
</Form.Item>



</div> 
             </MyFormItemGroup></Col></Row>
             <Row>
          <Col xs={{ span: 9, offset: 0 }}>
        <MyFormItemGroup>
     


<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" ,background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',width: '600px'}}>
            <Form.Item   name="adresse" label="Adresse" >
              <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black" }} />
            </Form.Item>
         
            <Form.Item name="tel" label="Tel" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
</Form.Item>



</div> 
             </MyFormItemGroup></Col></Row>
             <Row>
          <Col xs={{ span: 9, offset: 0 }}>
        <MyFormItemGroup>
     


<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" ,background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px', width: '600px'}}>
            <Form.Item   name="assurance" label="Assurance" >
              <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
            </Form.Item>
         
            <Form.Item name="nemuroAssurance" label="Nemuro d'assurance" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black" }} />
</Form.Item>



</div> 
             </MyFormItemGroup></Col></Row>





        <Row>
          <Col xs={{ span: 9, offset: 15 }}>
         
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",marginTop: '-554px',background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',width: '660px',marginLeft:'-160px' }}>
            <Form.Item    name="allergies" label="Allergies" >
              <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black" }} />
            </Form.Item>
         
            <Form.Item name="antecedentsMedicaux" label="Antecedents Medicaux" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black" }} />
</Form.Item>
      
            <Form.Item name="medicamentActuel" label="Medicament Actuel" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black"  }} />
</Form.Item>
      
</div> 

             </MyFormItemGroup></Col></Row>
        <Row>
          <Col xs={{ span: 9, offset: 15 }}>
            
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" ,marginTop: '-416px' ,background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',width: '660px',marginLeft:'-160px'}}>
            <Form.Item   name="poids" label="Poids" >
             <Input  disabled  type="text" style={{ color: "black", fontSize: "16px", borderColor: "black" }}   />

            </Form.Item>
         
            <Form.Item name="taille" label="Taille" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
</Form.Item>
      
</div> 

             </MyFormItemGroup></Col></Row>
        <Row>
          <Col xs={{ span: 9, offset: 15 }}>
            
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" ,marginTop: '-280px' ,background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px', width: '660px',marginLeft:'-160px' }}>
            <Form.Item   name="groupeSanguin" label="Groupe Sanguin" >
              <Input  disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black"  }} />
            </Form.Item>
         
            <Form.Item name="tensionArtetielle" label="Tension Artetielle" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black"  }} />
</Form.Item>
      
</div> 

             </MyFormItemGroup></Col></Row>
        <Row>
          <Col xs={{ span: 9, offset: 15 }}>
            
        <MyFormItemGroup>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" ,marginTop: '-142px' ,background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px', width: '660px',marginLeft:'-160px' }}>
            <Form.Item   name="frequenceCardiaque" label="Frequence Cardiaque" >
              <Input  disabled type="text" style={{ color: "black", fontSize: "16px" , borderColor: "black"  }} />
            </Form.Item>
         
            <Form.Item name="antecedentsFamiliaux" label="Antecedents Familiaux" >
  <Input disabled type="text" style={{ color: "black", fontSize: "16px", borderColor: "black"  }} />
</Form.Item>
      
</div> 

             </MyFormItemGroup></Col></Row>
        
             
         
             
             <Typography.Title level={4}>Ordonance</Typography.Title>

  <Table
                loading={loading}
                columns={columns}
                dataSource={user ? [user] : []}
                style={{  background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',}}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                }}

              ></Table>


<Typography.Title level={4}>Examen tests</Typography.Title>

  <Table
                loading={loading}
                columns={columns1}
                dataSource={examenTests ? [examenTests] : []}
                style={{  background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',}}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                }}

              ></Table>

<Typography.Title level={4}>Examen Resultats</Typography.Title>

  <Table
                loading={loading}
                columns={columns2}
                dataSource={examenResultats ? [examenResultats] : []}
                style={{  background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',}}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                }}

              ></Table> </div>
               
            <Button href="/dossiermedicaux" danger type="text">
              Annuler
            </Button>
           
            <Button onClick={downloadPDF}
            disabled={!(loader===false)}
            type="text">
              {loader?(
                <span>Downloading</span>
              ):(
                <span>Download</span>

              )}
            </Button>
      </Form>
    </motion.div>
  );
};

export default AfficherDossier;
