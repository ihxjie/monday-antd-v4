
export interface Attendance {
  attendanceId: string;
  clazzId: string;
  startTime: string;
  endTime: string;
  attendanceType?: string;
  attLongitude: string;
  attLatitude: string;
  attAccuracy: string;
}

export interface Student {
  userId: string;
  userAvatar: string;
  realName: string;
  userTel: string;
  userEmail: string;
}

export interface ClazzInfo {
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
