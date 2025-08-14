import React, { useState } from 'react';
import { AdminRegisterContainer, FormContainer, InputField, SubmitButton } from '../styles/AdminRegisterStyles';
import { registerAdmin } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    try {
      await registerAdmin({ email, password });
      navigate('/admin-signIn', { replace: true });
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
   

  return (
    <AdminRegisterContainer>
      <h2>Admin Register</h2>
      <FormContainer>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton onClick={(e) => handleRegister(e)}>Register</SubmitButton>

      </FormContainer>
    </AdminRegisterContainer>
  );
};

export default AdminRegister;
