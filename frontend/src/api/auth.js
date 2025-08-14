import apiClient from './client';

export const signInAdmin = (payload) => apiClient.post('/users/signin', payload);
export const signInStudent = (payload) => apiClient.post('/users/student/signin', payload);
export const signInTeacher = (payload) => apiClient.post('/users/teacher/signin', payload);
export const registerAdmin = (payload) => apiClient.post('/register/admin', payload);


