import type { Effect, Reducer } from 'umi';

import { fakeSubmitForm } from './service';

export interface StateType {
  current?: string;
  step?: {
    clazzName: string;
    clazzDescription: string;
    clazzLogo: [];
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
  };
}

const Model: ModelType = {
  namespace: 'classAndStepForm',

  state: {
    current: '',
    step: {
      clazzName: '',
      clazzDescription: '',
      clazzLogo: [],
    },
  },

  effects: {
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put({
        type: 'saveCurrentStep',
        payload: 'result',
      });
    },
  },

  reducers: {
    saveCurrentStep(state, { payload }) {
      console.log(payload)
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
  },
};

export default Model;
