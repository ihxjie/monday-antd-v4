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

export async function queryNotYetRecordStudentByAttendanceId(params: { attendanceId: any }) {
  return request('/api/record/queryNotYetRecordStudentByAttendanceId', {
    params,
  });
}

export async function queryVacationStudent(params: { attendanceId: any }) {
  return request('/api/record/queryVacationStudent', {
    params,
  });
}

export async function queryReissueByAttendanceId(params: { attendanceId: any }) {
  return request('/api/reissue/queryReissueByAttendanceId', {
    params,
  });
}

export async function agreeReissue( reissueId: string ) {
  return request('/api/reissue/agreeReissue', {
    method: 'POST',
    data: {
      reissueId: reissueId
    },
  });
}

export async function rejectReissue( reissueId: string ) {
  return request('/api/reissue/rejectReissue', {
    method: 'POST',
    data: {
      reissueId: reissueId
    },
  });
}