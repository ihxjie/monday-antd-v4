import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

import { fakeSubmitForm } from './service';

export interface StateType {
  current?: string;
  qrcode?: string;
  step?: {
    clazzName: string;
    clazzDescription: string;
    clazzLogo: string;
  };
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitStepForm: Effect;
  };
  reducers: {
    saveStepFormData: Reducer<StateType>;
    saveCurrentStep: Reducer<StateType>;
    saveQrcode: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'classAndStepForm',

  state: {
    current: '',
    qrcode: '',
    step: {
      clazzName: '',
      clazzDescription: '',
      clazzLogo: '',
    },
  },

  effects: {
    *submitStepForm({ payload }, { call, put }) {
      const response =  yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      if (response.message == 'Ok') {
        message.success("添加班级成功")
        yield put({
          type: 'saveCurrentStep',
          payload: 'result',
        });
        yield put({
          type: 'saveQrcode',
          payload: response.qrcodePath,
        });
      }else{
        message.error("添加班级失败")
      }
      
    },
  },

  reducers: {
    saveCurrentStep(state, { payload }) {
      console.log(state)
      return {
        ...state,
        current: payload,
      };
    },

    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...(state as StateType).step,
          ...payload,
        },
      };
    },
    saveQrcode(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        qrcode: payload,
      };
    }
  },
};

export default Model;
