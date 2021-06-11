export type AttendanceItem = {
  subscribe: string;
  clazzId: string;
  attendanceTime: Date[];
  attendanceType: string;
  attAccuracy: string;
  attendancePosition: string;
  attPosition: string;
};
export interface Attendance {
  attendanceId: string;
  clazzId: string;
  startTime: number;
  endTime: string;
  attendanceType?: string;
  attLongitude: string;
  attLatitude: string;
  attAccuracy: string;
  status: string;
}

export interface Student {
  userId: string;
  userAvatar: string;
  realName: string;
  userTel: string;
  userEmail: string;
}

export interface ClazzInfo {
  clazzId: string;
  clazzName: string;
  clazzDescription: string;
  clazzTeacher: string;
  isFinish: string;
}

export interface ClazzDataType {
  attendances: Attendance[];
  students: Student[];
  clazzInfo: ClazzInfo;
}
