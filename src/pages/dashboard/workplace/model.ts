import type { Effect, Reducer } from 'umi';
import type { ActivitiesType, ClazzType, CurrentUser, NoticeType, RadarDataType } from './data.d';
import { fakeChartData, queryActivities, queryClasses, queryCurrent, queryProjectNotice } from './service';

export interface ModalState {
  currentUser?: CurrentUser;
  classes: ClazzType[];
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
  radarData: RadarDataType[];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  reducers: {
    save: Reducer<ModalState>;
    clear: Reducer<ModalState>;
  };
  effects: {
    init: Effect;
    fetchUserCurrent: Effect;
    fetchClasses: Effect;
    fetchProjectNotice: Effect;
    fetchActivitiesList: Effect;
    fetchChart: Effect;
  };
}

const Model: ModelType = {
  namespace: 'dashboardAndworkplace',
  state: {
    currentUser: undefined,
    classes: [],
    projectNotice: [],
    activities: [],
    radarData: [],
  },
  effects: {
    *init(_, { put }) {
      yield put({ type: 'fetchUserCurrent' });
      yield put({ type: 'fetchClasses' })
      // yield put({ type: 'fetchProjectNotice' });
      // yield put({ type: 'fetchActivitiesList' });
      // yield put({ type: 'fetchChart' });
    },
    *fetchUserCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'save',
        payload: {
          currentUser: response,
        },
      });
    },
    *fetchClasses(_, { call, put }){
      const response = yield call(queryClasses);
      yield put({
        type: 'save',
        payload: {
          classes: Array.isArray(response) ? response : []
        }
      });
    },
    *fetchProjectNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'save',
        payload: {
          projectNotice: Array.isArray(response) ? response : [],
        },
      });
    },
    *fetchActivitiesList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'save',
        payload: {
          activities: Array.isArray(response) ? response : [],
        },
      });
    },
    *fetchChart(_, { call, put }) {
      const { radarData } = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          radarData,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        currentUser: undefined,
        classes: [],
        projectNotice: [],
        activities: [],
        radarData: [],
      };
    },
  },
};

export default Model;
