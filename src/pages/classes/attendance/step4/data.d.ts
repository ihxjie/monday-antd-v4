export interface AttendanceInfo {
  attendanceId: string;
  clazzId: string;
  clazzName: string;
  startTime: string;
  endTime: string;
  attendanceType?: string;
  attLongitude: string;
  attLatitude: string;
  attAccuracy: string;
  status: string;
  createdAt: string;
}

export interface Student {
  userId: string;
  userAvatar: string;
  realName: string;
  userTel: string;
  userEmail: string;
  attendanceTime: string;
}

export interface Reissue {
  reissueId: string;
  userId: string;
  userAvatar: string;
  realName: string;
  userTel: string;
  userEmail: string;
  createTime: string;
  reason: string;
  isAgree: string;
}

export interface Vacation {
  userAvatar: string;
  realName: string;
  userTel: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  dayNum: string;
  reason: string;
}

export interface AttendanceDataType {
  attendanceInfo: AttendanceInfo;
  students: Student[];
  notyetrecord: Student[];
  vacations: Vacation[];
}
