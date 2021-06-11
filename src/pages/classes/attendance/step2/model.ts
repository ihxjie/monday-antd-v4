import type { Effect, Reducer } from 'umi';
import type { AttendanceInfo, Student } from './data.d';
import { queryAttendanceInfo, queryStudentByAttendanceId, queryNotYetRecordStudentByAttendanceId, queryVacationStudentByAttendanceId } from './service';

export interface StateType {
  students: Student[];
  notyetrecord: Student[];
  vacations: Student[];
  attendanceInfo: Partial<AttendanceInfo>;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchAttendanceInfo: Effect;
    fetchStudentByAttendanceId: Effect;
    fetchNotYetRecordStudentByAttendanceId: Effect;
    fetchVacationStudentByAttendanceId: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'attendance',

  state: {
    students: [],
    notyetrecord: [],
    vacations: [],
    attendanceInfo: {}
  },

  effects: {
    *fetchAttendanceInfo({ payload }, { call, put }) {
      
      const response = yield call(queryAttendanceInfo, payload);
      yield put({
        type: 'show',
        payload: {
          attendanceInfo: response
        }
      });
    },
    *fetchStudentByAttendanceId({ payload }, { call, put }) {
      const response = yield call(queryStudentByAttendanceId, payload);
      yield put({
        type: 'show',
        payload: {
          students: response
        }
      });
    },
    *fetchNotYetRecordStudentByAttendanceId({ payload }, { call, put }) {
      const response = yield call(queryNotYetRecordStudentByAttendanceId, payload);
      yield put({
        type: 'show',
        payload: {
          notyetrecord: response
        }
      });
    },
    *fetchVacationStudentByAttendanceId({ payload }, { call, put }) {
      const response = yield call(queryVacationStudentByAttendanceId, payload);
      yield put({
        type: 'show',
        payload: {
          vacations: response
        }
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
