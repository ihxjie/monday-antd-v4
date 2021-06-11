import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
  QrcodeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Divider,
  Dropdown,
  Menu,
  Popover,
  Steps,
  Table,
  Tooltip,
  Empty,
  Popconfirm,
  message,
} from 'antd';
import { Line, Liquid } from '@ant-design/charts';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment, useRef, useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import type { Dispatch } from 'umi';
import { connect, Link } from 'umi';
import type { AttendanceDataType, Student, Vacation } from './data.d';
import styles from './style.less';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { 
  finishAttendanceStep2,
  agreeVacation,
  manualReissue,
  queryStudentByAttendanceId,
  queryNotYetRecordStudentByAttendanceId,
  queryVacationStudentByAttendanceId,

} from './service';

const { Step } = Steps;



const StudentTable: React.FC<{ attendanceId: any }> = ( {attendanceId} ) => {
  const studentRef = useRef<ActionType>();
  const notYetRef = useRef<ActionType>();
  const vacationRef = useRef<ActionType>();

  const confirm = (userId: string, attendanceId: string) => {
    handleAgreeReissue(userId, attendanceId);
  }
  const handleAgreeReissue = async (userId: string, attendanceId: string) => {
    const hide = message.loading('正在请求');
    try {
      const res = await agreeVacation({userId: userId, attendanceId: attendanceId});
      hide();
      message.success(res);
      studentRef.current.reload();
      notYetRef.current.reload();
      vacationRef.current.reload();
      return true;
    } catch (error) {
      console.error(error)
      hide();
      message.error('请求失败，请检查网络后重试！');
      return false;
    }
  }

  const manual = (userId: string, attendanceId: string) => {
    handleManualReissue(userId, attendanceId);
  }
  const handleManualReissue =  async (userId: string, attendanceId: string) => {
    const hide = message.loading('正在请求');
    try {
      const res = await manualReissue({studentId: userId, attendanceId: attendanceId});
      hide();
      message.success(res);
      studentRef.current.reload();
      notYetRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('请求失败，请检查网络后重试！');
      return false;
    }
  }

  useEffect(() => {
    var cnt = 0;
    var interval = setInterval(function(){
      if (cnt < 24) {
        studentRef.current.reload();
        notYetRef.current.reload();
        cnt += 1;
      } else {
        clearInterval(interval);
      }
    }, 5000)
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
      title: '编号',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      key: 'userAvatar',
      valueType: 'avatar',
      hideInSearch: true,
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
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title="手动补签"
          onConfirm={manual.bind(this, record.userId, attendanceId)}
          okText="确认"
          cancelText="取消"
        >
          <a>
            手动补签
          </a>
        </Popconfirm>
      ],
    },
  ];

  const vacation: ProColumns<Vacation>[] = [
    {
      title: '编号',
      dataIndex: 'userId',
      key: 'userId'
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
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title="是否通过该请假请求？"
          onConfirm={confirm.bind(this, record.userId, attendanceId)}
          okText="同意"
          cancelText="拒绝"
        >
          <a>
            是否通过？
          </a>
        </Popconfirm>
      ],
    },
  ];

  return (
    <Card>
      <ProTable<Student>
        headerTitle="已签到学生"
        actionRef={studentRef}
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
      <ProTable<Student>
        headerTitle="未签到学生"
        actionRef={notYetRef}
        style={{ marginBottom: 24 }}
        columns={notRecordStudent}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        request={async (params, sorter, filter) => {
          const msg = await queryNotYetRecordStudentByAttendanceId({ attendanceId: attendanceId, userId: params.userId, realName: params.realName });
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
        pagination={false}
        columns={vacation}
        search={false}
        request={async () => {
          const msg = await queryVacationStudentByAttendanceId({ attendanceId: attendanceId });
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

const AttendanceChart: React.FC<{ attendanceId: string }> = (attendanceId) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
    var cnt = 0;
    var interval = setInterval(function(){
      if (cnt < 24) {
        asyncFetch();
        cnt += 1;
      } else {
        clearInterval(interval);
      }
    }, 5000)
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
  finish = async (attendanceId: string) => {
    const msg = await finishAttendanceStep2({attendanceId})
    message.success(msg);
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
      <Statistic title="状态" value="签到进行中" />
    );

    const desc1 = (
      <div className={classNames(styles.textSecondary, styles.stepDescription)}>
        <div>{attendanceInfo.createdAt}</div>
      </div>
    );
    
    const desc2 = (
      <div className={styles.stepDescription}>
        <div>
          <Link to={{ pathname: "/classes/attendance/step3", search: '?attendanceId=' + attendanceId}}>
            <a onClick={this.finish.bind(this, attendanceId)}>结束</a>
          </Link>
        </div>
      </div>
    );

    const popoverContent = (
      
      <div style={{ width: 160 }}>
        <div className={styles.textSecondary} style={{ marginTop: 4 }}>
          开始时间：{moment(attendanceInfo.startTime).fromNow()}
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

    const action = (
      <RouteContext.Consumer>
        {(type) => {
          return (
            <Fragment>
              <Link to={{ pathname: "/classes/qrcode", search: '?attendanceId=' + attendanceId}} target="_blank">
                <Button icon={<QrcodeOutlined />} type="primary">签到二维码</Button>
              </Link>
              
            </Fragment>
          );
        }}
      </RouteContext.Consumer>
    );

    return (
      <PageContainer
        title={this.getAttendanceId(attendanceInfo.attendanceId)}
        extra={action}
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
                    current={1}
                  >
                    <Step title="创建签到" description={desc1} />
                    <Step title="学生签到" description={desc2} />
                    <Step title="接收补签请求" />
                    <Step title="结束" />
                  </Steps>
                )}
              </RouteContext.Consumer>
            </Card>
            <Card title="签到进度" style={{ marginBottom: 24 }} bordered={false}>
              <AttendanceChart attendanceId={attendanceId} />
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
