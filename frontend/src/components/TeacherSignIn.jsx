// TeacherSignIn.js
import React, { useState } from 'react';
import { TeacherSignInContainer, FormContainer, InputField, SubmitButton } from '../styles/TeacherSignInStyles';
import { useNavigate } from 'react-router-dom';
import { signInTeacher } from '../api/auth';

const TeacherSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInTeacher({ email, password });
      navigate('/teacher/dashboard', { replace: true });
    } catch (error) {
      console.error('Teacher sign-in error:', error);
    }
  };

  return (
    <TeacherSignInContainer>
      <h2>Teacher Sign In</h2>
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
        <SubmitButton onClick={handleSignIn}>Sign In</SubmitButton>
      </FormContainer>
    </TeacherSignInContainer>
  );
};

export default TeacherSignIn;
