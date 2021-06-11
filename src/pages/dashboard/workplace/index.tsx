import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import React, { Component } from 'react';

import type { Dispatch} from 'umi';
import { Link, connect } from 'umi';
// import { Link as ReactLink } from 'react-router';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import Radar from './components/Radar';
import type { ModalState } from './model';
import styles from './style.less';
import type { ActivitiesType, CurrentUser, ClazzType, NoticeType, RadarDataType } from './data.d';

interface WorkplaceProps {
  currentUser?: CurrentUser;
  classes: ClazzType[];
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
  radarData: RadarDataType[];
  dispatch: Dispatch;
  currentUserLoading: boolean;
  classesLoading: boolean;
  activitiesLoading: boolean;
}

const PageHeaderContent: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          你好，
          {currentUser.name}
          ，祝你开心每一天！
        </div>
        <div>
          {currentUser.title} | {currentUser.group}
        </div>
      </div>
    </div>
  );
};

const ExtraContent: React.FC<{}> = () => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="班级数" value={56} />
    </div>

    <div className={styles.statItem}>
      <Statistic title="项目访问" value={2223} />
    </div>
  </div>
);

class Workplace extends Component<WorkplaceProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndworkplace/init',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndworkplace/clear',
    });
  }

  renderActivities = (item: ActivitiesType) => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }
      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    const {
      currentUser,
      activities,
      classes,
      classesLoading,
      activitiesLoading,
      radarData,
    } = this.props;

    if (!currentUser || !currentUser.userid) {
      return null;
    }
    return (
      <PageContainer
        content={<PageHeaderContent currentUser={currentUser} />}
      >
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="全部班级"
              extra={<Link to="/classes/step-form">添加班级</Link>}
              loading={classesLoading}
              bodyStyle={{ padding: 0 }}
            >
              {classes.map((item) => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Link to={{ pathname : '/classes/clazz', search: '?clazzId=' + item.id }}>
                    <Card bodyStyle={{ padding: 0 }} bordered={false}>
                      <Card.Meta
                        title={
                          <div className={styles.cardTitle}>
                            <Avatar size="small" src={item.logo} />
                            <Link to='/'>{item.title}</Link>
                          </div>
                        }
                        description={item.description}
                      />
                      <div className={styles.projectItemContent}>
                        <Link to={'/'}>{ item.teacher || '' }</Link>
                        {item.updatedAt && (
                          <span className={styles.datetime} title={item.updatedAt}>
                            {moment(item.updatedAt).fromNow()}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                </Card.Grid>
              ))}
            </Card>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default connect(
  ({
    dashboardAndworkplace: { currentUser, classes, projectNotice, activities, radarData },
    loading,
  }: {
    dashboardAndworkplace: ModalState;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    currentUser,
    classes,
    projectNotice,
    activities,
    radarData,
    currentUserLoading: loading.effects['dashboardAndworkplace/fetchUserCurrent'],
    classesLoading: loading.effects['dashboardAndworkplace/fetchClasses'],
    activitiesLoading: loading.effects['dashboardAndworkplace/fetchActivitiesList'],
  }),
)(Workplace);
