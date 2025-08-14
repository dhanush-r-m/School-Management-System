// StudentSignIn.js
import React, { useState } from 'react';
import { StudentSignInContainer, FormContainer, InputField, SubmitButton } from '../styles/StudentSignInStyles';
import { useNavigate } from 'react-router-dom';
import { signInStudent } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const StudentSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInStudent({ email, password });
      setUser({ role: 'student', email });
      navigate('/student/dashboard', { replace: true });
    } catch (error) {
      console.error('Student sign-in error:', error);
    }
  };

  return (
    <StudentSignInContainer>
      <h2>Student Sign In</h2>
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
    </StudentSignInContainer>
  );
};

export default StudentSignIn;
