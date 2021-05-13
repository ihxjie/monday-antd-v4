import request from 'umi-request';

export async function queryStudentByClazzId(params: { clazzId: any }) {
  return request('/api/user/queryStudentByClazzId', {
    params,
  });
}

export async function queryClazzInfo(params: { clazzId: any }) {
  return request('/api/clazz/clazzInfo', {
    params,
  });
}

export async function queryAttendanceByClazzId(params: { clazzId: any }) {
  return request('/api/attendance/queryAttendanceByClazzId', {
    params,
  });
}
