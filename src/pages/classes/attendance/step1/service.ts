import request from 'umi-request';
import { AttendanceItem } from './data';

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function updateAttendance(params: AttendanceItem) {
  return request('/api/attendance/update', {
    method: 'POST',
    data: {
      attendanceId: params.attendanceId,
      subscribe: params.subscribe,
      clazzId: params.clazzId,
      startTime: params.attendanceTime[0],
      endTime: params.attendanceTime[1],
      attAccuracy: params.attendanceType,
      attendanceType: params.attendanceType
    },
  });
}