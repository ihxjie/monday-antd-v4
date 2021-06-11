import request from 'umi-request';

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryAttendanceInfo(params: { attendanceId: any }) {
  return request('/api/attendance/queryAttendanceInfo', {
    params,
  });
}

export async function queryStudentByAttendanceId(params: { attendanceId: any }) {
  return request('/api/record/queryStudentByAttendanceId', {
    params,
  });
}

export async function queryNotYetRecordStudentByAttendanceId(params: { attendanceId: any, userId: string, realName: string }) {
  return request('/api/record/queryNotYetRecordStudentByAttendanceId', {
    params,
  });
}

export async function queryVacationStudentByAttendanceId(params: { attendanceId: any }) {
  return request('/api/record/queryVacationStudentByAttendanceId', {
    params,
  });
}

export async function agreeVacation(params: { userId: string, attendanceId: string }) {
  return request('/api/vacation/agreeVacation', {
    params,
  });
}

export async function finishAttendanceStep2(params: { attendanceId: string }) {
  return request('/api/attendance/finishAttendanceStep2', {
    params,
  });
}

export async function manualReissue(params: {studentId: string, attendanceId: string}) {
  return request('/api/reissue/manualReissue', {
    params,
  });
}