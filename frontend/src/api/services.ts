import api from './index';
import type {
  Class,
  User,
  Activity,
  Signup,
  RegisterRequest,
  CreateActivityRequest,
  SignupRequest,
  DeleteActivityRequest,
  GetUserNameRequest,
  DeleteUserRequest,
  ChangeActivityStatusRequest,
} from './types';

// 用户注册
export const register = (data: RegisterRequest) => {
  return api.post('/register', data);
};

// 根据用户ID获取用户名
export const getUserNameById = (data: GetUserNameRequest) => {
  return api.post<string>('/getname', data);
};

// 获取班级列表
export const getClasses = () => {
  return api.get<Class[]>('/class');
};

// 创建活动
export const createActivity = (data: CreateActivityRequest) => {
  return api.post('/activities', data);
};

// 获取活动列表
export const getActivities = () => {
  return api.get<Activity[]>('/activities');
};

// 获取报名列表
export const getSignups = () => {
  return api.get<Signup[]>('/sign');
};

// 删除活动
export const deleteActivity = (data: DeleteActivityRequest) => {
  return api.delete('/activities', { data });
};

// 报名活动
export const signUpActivity = (data: SignupRequest) => {
  return api.post('/sign', data);
};

// 取消报名
export const cancelSignUp = (data: SignupRequest) => {
  return api.delete('/sign', { data });
};

// 获取所有用户
export const getAllUsers = () => {
  return api.get<User[]>('/user');
};

// 删除用户
export const deleteUser = (data: DeleteUserRequest) => {
  return api.delete('/user', { data });
};

// 改变活动状态
export const changeActivityStatus = (data: ChangeActivityStatusRequest) => {
  return api.put('/activities/status', data);
};

