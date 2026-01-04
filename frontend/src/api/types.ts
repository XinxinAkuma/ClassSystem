export interface Class {
  class_id: string;
  class_name: string;
  grade: string;
  major: string;
  counselor_id: string;
  member_count: number;
}

export interface User {
  user_id: string;
  school_num: string;
  name: string;
  password: string;
  phone: string;
  email: string;
  status: number;
  role: string;
  class_id: string;
  create_time: string;
}

export interface Activity {
  activityId: number;
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  signupStart: string;
  signupEnd: string;
  leaderId: string;
  budget: number;
  status: string;
  maxPeople: number;
}

export interface Signup {
  id: number;
  activityId: number;
  userId: string;
  status: string;
  signupTime: string;
}

export interface RegisterRequest {
  user_id?: string;
  school_num: string;
  name: string;
  password: string;
  phone: string;
  email: string;
  role: string;
  class_id: string;
}

export interface CreateActivityRequest {
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  signupStart: string;
  signupEnd: string;
  leader_id: string;
  budget: number;
  status: string;
  maxPeople: number;
}

export interface SignupRequest {
  activityId: number;
  userId: string;
}

export interface DeleteActivityRequest {
  activityId: number;
}

export interface GetUserNameRequest {
  userId: string;
}

