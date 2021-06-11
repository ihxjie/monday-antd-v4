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

export type AttendanceItem = {
  attendanceId: string;
  subscribe: string;
  clazzId: string;
  attendanceTime: Date[];
  attendanceType: string;
  attAccuracy: string;
};

export interface Student {
  userId: string;
  userAvatar: string;
  realName: string;
  userTel: string;
  userEmail: string;
  attendanceTime: string;
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