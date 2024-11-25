import React, { useState } from 'react';
import { Card, Button, Input, Form, Modal, message, Typography } from 'antd';
import axios from './axiosConfig';

const { Title } = Typography;

const UserManagement = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'username', 'password', 'delete'

  const handleModalOpen = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values) => {
    const { password, newUsername, newPassword } = values;

    setLoading(true);
    try {
      if (modalType === 'username') {
        await axios.patch('/users/account', {
          password,
          username: newUsername,
        });
        message.success('Username updated successfully!');
      } else if (modalType === 'password') {
        await axios.patch('/users/account', {
          password,
          new_password: newPassword,
        });
        message.success('Password updated successfully!');
      } else if (modalType === 'delete') {
        await axios.delete('/users/account', {
          data: { password },
        });
        message.success('Account deleted successfully!');
        window.location.href = '/'; // Redirect after account deletion
      }
      handleModalClose();
    } catch (error) {
      message.error(error.response?.data?.error || 'Error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="user-management-card" style={{ marginTop: '20px' }}>
        <Title level={3}>Account Management</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button type="primary" onClick={() => handleModalOpen('username')}>
            Change Username
          </Button>
          <Button type="default" onClick={() => handleModalOpen('password')}>
            Change Password
          </Button>
          <Button type="danger" onClick={() => handleModalOpen('delete')}>
            Delete Account
          </Button>
        </div>
      </Card>

      <Modal
        title={
          modalType === 'username'
            ? 'Change Username'
            : modalType === 'password'
            ? 'Change Password'
            : 'Delete Account'
        }
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            label="Current Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your current password' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          {modalType === 'username' && (
            <Form.Item
              label="New Username"
              name="newUsername"
              rules={[
                { required: true, message: 'Please enter your new username' },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          {modalType === 'password' && (
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters long' },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {modalType === 'delete' ? 'Delete Account' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
