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

export async function queryReissueByAttendanceId(params: { attendanceId: any }) {
  return request('/api/reissue/queryReissueByAttendanceId', {
    params,
  });
}

export async function agreeReissue(params: {reissueId: string}) {
  return request('/api/reissue/agreeReissue', {
    params,
  });
}

export async function rejectReissue(params: {reissueId: string}) {
  return request('/api/reissue/rejectReissue', {
    params,
  });
}

export async function manualReissue(params: {studentId: string, attendanceId: string}) {
  return request('/api/reissue/manualReissue', {
    params,
  });
}

export async function finishAttendanceStep3(params: { attendanceId: string }) {
  return request('/api/attendance/finishAttendanceStep3', {
    params,
  });
}