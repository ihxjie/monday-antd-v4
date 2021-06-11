import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Popconfirm,
  Divider,
  Dropdown,
  message,
  Menu,
  Popover,
  Steps,
  Table,
  Tooltip,
  Empty,
  Col,
  Row,
} from 'antd';
import { Line, Liquid, DualAxes, Pie  } from '@ant-design/charts';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment, useRef, useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { AttendanceDataType, Student, Vacation, Reissue } from './data.d';
import styles from './style.less';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { 
  agreeReissue,
  rejectReissue,
  queryReissueByAttendanceId,
  queryStudentByAttendanceId,
  queryNotYetRecordStudentByAttendanceId,
  queryVacationStudent,

} from './service';

const { Step } = Steps;

const StudentTable: React.FC<{ attendanceId: any }> = ( {attendanceId} ) => {
  const recordRef = useRef<ActionType>();
  const notYetRef = useRef<ActionType>();
  const vacationRef = useRef<ActionType>();

  useEffect(() => {
    // var cnt = 0;
    // var interval = setInterval(function(){
    //   if (cnt < 24) {
    //     // reissueRef.current.reload();
    //     // notYetRef.current.reload();
    //     cnt += 1;
    //   } else {
    //     clearInterval(interval);
    //   }
    // }, 5000)
  }, []);

  const student: ProColumns<Student>[] = [
    {
      title: '编号',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      key: 'userAvatar',
      valueType: 'avatar',
      
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
      copyable: true,
    },
    {
      title: '电话',
      dataIndex: 'userTel',
      key: 'userTel',
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: '签到时间',
      dataIndex: 'attendanceTime',
      key: 'attendanceTime'
    }
  ];

  const notRecordStudent: ProColumns<Student>[] = [
    {
      title: '学号',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      key: 'userAvatar',
      valueType: 'avatar',
      
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
      copyable: true,
    },
    {
      title: '电话',
      dataIndex: 'userTel',
      key: 'userTel',
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
  ];

  const vacation: ProColumns<Vacation>[] = [
    {
      title: '编号',
      dataIndex: 'userId',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'avatar',
      
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      copyable: true,
    },
    {
      title: '电话',
      dataIndex: 'userTel',
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
    },
    {
      title: '请假起始时间',
      dataIndex: 'startTime',
    },
    {
      title: '请假结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '请假天数',
      dataIndex: 'dayNum',
    },
    {
      title: '请假因由',
      dataIndex: 'reason',
    },
  ];

  return (
    <Card>
      <ProTable<Student>
        headerTitle="未签到学生"
        actionRef={notYetRef}
        style={{ marginBottom: 24 }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        columns={notRecordStudent}
        search={false}
        request={async () => {
          const msg = await queryNotYetRecordStudentByAttendanceId({ attendanceId: attendanceId });
          return {
            data: msg,
            success: true,
          }
        }}
        rowKey="userId"
      />
      <ProTable<Student>
        headerTitle="已签到学生"
        actionRef={recordRef}
        style={{ marginBottom: 24 }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        columns={student}
        search={false}
        request={async () => {
          const msg = await queryStudentByAttendanceId({ attendanceId: attendanceId });
          return {
            data: msg,
            success: true,
          }
        }}
        rowKey="userId"
      />
      <ProTable<Vacation>
        headerTitle="已请假学生"
        actionRef={vacationRef}
        style={{ marginBottom: 24 }}
        pagination={{
          showQuickJumper: true,
          pageSize: 5,
        }}
        columns={vacation}
        search={false}
        request={async () => {
          const msg = await queryVacationStudent({ attendanceId: attendanceId });
          return {
            data: msg,
            success: true,
          }
        }}
        rowKey="userId"
      />
    </Card>
  )

}

const AttendanceLiquid: React.FC<{ attendanceId: string }> = (attendanceId) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch('/api/attendance/queryProcess/' + attendanceId.attendanceId)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  var config = {
    percent: data,
    outline: {
      border: 4,
      distance: 8,
    },
    wave: { length: 128 },
  };

  // @ts-ignore
  return <Liquid {...config} />;
};

const AttendancePie: React.FC<{ attendanceId: string }> = (attendanceId) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch('/api/record/queryAttendancePie/' + attendanceId.attendanceId)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: function formatter(v) {
          return ''.concat(v, ' 人');
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: { textAlign: 'center' },
      autoRotate: false,
      content: '{value}',
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      { type: 'pie-statistic-active' },
    ],
  };

  return <Pie {...config} />;
};

const AttendanceDualAxes: React.FC<{ attendanceId: string }> = (attendanceId) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch('/api/record/queryAttendanceDualAxes/' + attendanceId.attendanceId)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  var config = {
    data: [data, data],
    xField: 'time',
    yField: ['value', 'count'],
    geometryOptions: [
      { geometry: 'column' },
      {
        geometry: 'line',
        smooth: true,
        lineStyle: { lineWidth: 2 },
      },
    ],
    meta: {
      value: {
        alias: '柱状图',

      },
      count: {
        alias: '折线图',
      },
    },
  };

  // @ts-ignore
  return <DualAxes {...config} />;
};

interface AdvancedState {
  operationKey: string;
  tabActiveKey: string;
}

interface AdvancedProps {
  loading: boolean; 
  studentLoading: boolean;
  attendance: AttendanceDataType; 
  dispatch: Dispatch; 
  location: any; 
}

class Advanced extends Component<AdvancedProps, AdvancedState> {

  componentDidMount() {
    const { dispatch } = this.props;
    const attendanceId = this.props.location.query.attendanceId
    
    dispatch({
      type: 'attendance/fetchAttendanceInfo',
      payload: {
        attendanceId: attendanceId,
      }
    });

  }

  getAttendanceType(text: string) {
    if (text == '1') {
      return "点击签到";
    }else if (text == '2') {
      return "二维码签到";
    }else if (text == '3') {
      return "地理位置签到";
    }else if (text == '4') {
      return "人脸识别签到";
    }else if (text == '5') {
      return "人脸+地理位置签到";
    }else if (text == '6') {
      return "地理位置+二维码签到";
    }
    return "未定义";
  }
  finishAttendance(text: string) {
    return "/api/attendance/finish?attendanceId=" + text;
  }
  getAttendanceId(text: string) {
    return "签到编号：" + text;
  }

  render() {
    const { attendance } = this.props;
    const { attendanceInfo } = attendance;
    const attendanceId = this.props.location.query.attendanceId

    // console.error("ppp: ", attendanceInfo)

    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
            <Descriptions.Item label="签到方式">{this.getAttendanceType(attendanceInfo.attendanceType)}</Descriptions.Item>
            <Descriptions.Item label="签到班级">{attendanceInfo.clazzName}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{attendanceInfo.createdAt}</Descriptions.Item>
            <Descriptions.Item label="起止时间">{attendanceInfo.startTime} ~ {attendanceInfo.endTime}</Descriptions.Item>
            
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const extra = (
      <Statistic title="状态" value="签到结束" />
    );

    const desc1 = (
      <div className={classNames(styles.textSecondary, styles.stepDescription)}>
        <div>{attendanceInfo.createdAt}</div>
      </div>
    );

    const desc2 = (
      <div className={classNames(styles.textSecondary, styles.stepDescription)}>
        <div>{attendanceInfo.endTime}</div>
      </div>
    );
    
    const desc3 = (
      <div className={styles.stepDescription}>
        <div className={classNames(styles.textSecondary, styles.stepDescription)}>
          <div>补签结束</div>
        </div>
      </div>
    );

    const popoverContent = (
      
      <div style={{ width: 160 }}>
        <div className={styles.textSecondary} style={{ marginTop: 4 }}>
          签到已结束
        </div>
      </div>
    );
    
    const customDot = (
      dot: React.ReactNode,
      {
        status,
      }: {
        status: string;
      },
    ) => {
      if (status === 'process') {
        return (
          <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
            {dot}
          </Popover>
        );
      }
      return dot;
    };

    return (
      <PageContainer
        title={this.getAttendanceId(attendanceInfo.attendanceId)}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <div className={styles.main}>
          <GridContent>
            <Card title="签到进度" style={{ marginBottom: 24 }}>
              <RouteContext.Consumer>
                {({ isMobile }) => (
                  <Steps
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    progressDot={customDot}
                    current={3}
                  >
                    <Step title="创建签到" description={desc1} />
                    <Step title="学生签到" description={desc2} />
                    <Step title="接收补签请求" description={desc3} />
                    <Step title="结束" />
                  </Steps>
                )}
              </RouteContext.Consumer>
            </Card>

            <Card style={{ marginBottom: 24 }} bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="签到率">
                    <AttendanceLiquid attendanceId={attendanceId} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="签到人数">
                    <AttendancePie attendanceId={attendanceId} />
                  </Card>
                </Col>

              </Row>
            </Card>

            <Card title="指定签到时间内签到进度" style={{ marginBottom: 24 }} bordered={false}>
              <AttendanceDualAxes attendanceId={attendanceId} />
            </Card>
            
            <StudentTable attendanceId={attendanceId} />

          </GridContent>
        </div>
      </PageContainer>
    );
  }
}

export default connect(
  ({
    attendance,
    loading,
  }: {
    attendance: AttendanceDataType;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    attendance,
    studentLoading: loading.effects['clazz/fetchStudent'],
    loading: loading.effects['attendance/fetchAttendanceInfo'],
  }),
)(Advanced);
