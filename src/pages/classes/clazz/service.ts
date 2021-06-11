import request from 'umi-request';
import { AttendanceItem } from './data';

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

export async function addAttendance(params: AttendanceItem) {
  return request('/api/attendance/add', {
    method: 'POST',
    data: {
      subscribe: params.subscribe,
      clazzId: params.clazzId,
      startTime: params.attendanceTime[0],
      endTime: params.attendanceTime[1],
      attAccuracy: params.attAccuracy,
      attendanceType: params.attendanceType,
      attPosition: params.attPosition,
    },
  });
}

export async function removeStudent(studentId: string, clazzId: string) {
  return request('/api/clazz/removeStudent', {
    method: 'POST',
    data: {
      studentId: "" + studentId,
      clazzId: clazzId,
    },
  });
}

export async function removeAttendance(attendanceId: string) {
  return request('/api/attendance/removeAttendance', {
    method: 'POST',
    data: {
      attendanceId: attendanceId
    },
  });
}

export async function queryClazzTeacher(params: { clazzId: any }) {
  return request('/api/clazz/queryClazzTeacher', {
    params,
  });
}

export async function queryAddressByKeyword(params: { keyword: any }) {
  return request('/api/map/queryAddressByKeyword', {
    params,
  });
}

export async function finishClazz(params: { clazzId: string }) {
  return request('/api/clazz/finishClazz', {
    params,
  })
}