import React from "react";
import { Form, Row, Col, TimePicker, Button, Input } from "antd";
import moment from "moment";

const DoctorProfile = ({ onFinish, data }) => {
  return (
    <Form 
      layout="vertical" 
      onFinish={onFinish} 
      initialValues={{
        ...data,
        ...(data && {
          timings: [
            moment(data?.timings[0], 'HH:mm'),
            moment(data?.timings[1], 'HH:mm')
          ]
        })
      }}
    >
      <h1 className="page-subtitle mt-3">Información personal </h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Nombre"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nombre" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Apellido"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Apellido" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Teléfono"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Teléfono" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Website"
            name="website"
            rules={[{ required: true }]}
          >
            <Input placeholder="Website" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Domicilio"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Domicilio" />
          </Form.Item>
        </Col>
      </Row>
      <h1 className="page-subtitle mt-3">Información profesional</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Especialidad"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Especialidad" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Experiencia"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experiencia" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Tarifa por consulta"
            name="feePerConsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Tarifa por consulta" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Horario"
            name="timings"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker
              format={'HH:mm'} 
              placeholder={[ 'Inicio' , 'Fin']}
            />
          </Form.Item>
        </Col>

      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          SUBMIT
        </Button>
      </div>
    </Form>
  );
};

export default DoctorProfile;
