import { string } from 'prop-types';
import type { Effect, Reducer } from 'umi';

import type { Attendance, Student, ClazzInfo } from './data.d';
import { queryAttendanceByClazzId, queryClazzInfo, queryStudentByClazzId } from './service';

export interface StateType {
  attendances: Attendance[];
  students: Student[];
  clazzInfo: Partial<ClazzInfo>;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchAttendance: Effect;
    fetchStudent: Effect;
    fetchClazzInfo: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'clazz',

  state: {
    attendances: [],
    students: [],
    clazzInfo: {},
  },

  effects: {
    
    *fetchAttendance({ payload }, { call, put }) {
      const response = yield call(queryAttendanceByClazzId, payload);
      yield put({
        type: 'show',
        payload: {
          attendances: Array.isArray(response) ? response : [],
        },
      });
    },
    *fetchStudent({ payload }, { call, put }) {
      const response = yield call(queryStudentByClazzId, payload);
      yield put({
        type: 'show',
        payload: {
          students: Array.isArray(response) ? response : [],
        },
      });
    },
    *fetchClazzInfo({ payload }, { call, put }) {
      const response = yield call(queryClazzInfo, payload);
      yield put({
        type: 'show',
        payload: {
          clazzInfo: response,
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
