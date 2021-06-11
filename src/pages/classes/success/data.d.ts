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

export interface AttendanceDataType {
  attendanceInfo: AttendanceInfo;
  students: Student[];
  notyetrecord: Student[];
  vacations: Vacation[];
}
