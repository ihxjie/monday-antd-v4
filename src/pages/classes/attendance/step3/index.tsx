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
} from 'antd';
import { Line, Liquid } from '@ant-design/charts';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment, useRef, useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import type { Dispatch } from 'umi';
import { connect, Link } from 'umi';
import type { AttendanceDataType, Student, Vacation, Reissue } from './data.d';
import styles from './style.less';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { DualAxes, G2 } from '@ant-design/charts';
import { 
  agreeReissue,
  rejectReissue,
  manualReissue,
  finishAttendanceStep3,
  queryReissueByAttendanceId,
  queryNotYetRecordStudentByAttendanceId,
  queryVacationStudentByAttendanceId,

} from './service';

const { Step } = Steps;

const StudentTable: React.FC<{ attendanceId: any }> = ( {attendanceId} ) => {
  const reissueRef = useRef<ActionType>();
  const notYetRef = useRef<ActionType>();
  const vacationRef = useRef<ActionType>();

  const confirm = (reissueId: string) => {
    handleAgreeReissue(reissueId);
  }
  const handleAgreeReissue = async (reissueId: string) => {
    const hide = message.loading('正在请求');
    try {
      const res = await agreeReissue({reissueId: reissueId});
      hide();
      message.success(res);
      reissueRef.current.reload();
      notYetRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('请求失败，请检查网络后重试！');
      return false;
    }
  }
  
  const cancel = (reissueId: string) => {
    handleRejectReissue(reissueId);
  }
  const handleRejectReissue = async (reissueId: string) => {
    const hide = message.loading('正在请求');
    try {
      const res = await rejectReissue({reissueId: reissueId});
      hide();
      message.error(res);
      reissueRef.current.reload();
      notYetRef.current.reload();
      return true;
    } catch (error) {
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
      reissueRef.current.reload();
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
        // reissueRef.current.reload();
        // notYetRef.current.reload();
        cnt += 1;
      } else {
        clearInterval(interval);
      }
    }, 5000)
  }, []);

  const reissueStudent: ProColumns<Reissue>[] = [
    {
      title: '编号',
      dataIndex: 'reissueId',
    },
    {
      title: '学号',
      dataIndex: 'userId',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'avatar',
      ellipsis: true,
      
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      copyable: true,
    },
    {
      title: '电话',
      dataIndex: 'userTel',
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      ellipsis: true,
    },
    {
      title: '发起时间',
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '补签原因',
      dataIndex: 'reason',
      ellipsis: true,
    },
    {
      title: '处理结果',
      dataIndex: 'isAgree',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '未处理', status: "Default" },
        1: { text: '同意', status: 'Success' },
        2: { text: '拒绝', status: 'Error' },
      }
    },
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title="是否同意该同学的补签请求？"
          onConfirm={confirm.bind(this, record.reissueId)}
          onCancel={cancel.bind(this, record.reissueId)}
          okText="同意"
          cancelText="拒绝"
        >
          <a>
            补签操作
          </a>
        </Popconfirm>
      ],
    },

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
      <ProTable<Reissue>
        headerTitle="申请补签学生"
        actionRef={reissueRef}
        style={{ marginBottom: 24 }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        columns={reissueStudent}
        search={false}
        request={async () => {
          const msg = await queryReissueByAttendanceId({ attendanceId: attendanceId });
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
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        columns={notRecordStudent}
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
        pagination={{
          showQuickJumper: true,
          pageSize: 5,
        }}
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
    console.log('hello: ', location, this.props.location)
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
    const msg = await finishAttendanceStep3({attendanceId})
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
      <Statistic title="状态" value="正在接收补签请求" />
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
        <div>
          <Link to={{ pathname: "/classes/attendance/step4", search: '?attendanceId=' + attendanceId}}>
            <a onClick={this.finish.bind(this, attendanceId)}>结束</a>
          </Link>
        </div>
      </div>
    );

    const popoverContent = (
      
      <div style={{ width: 160 }}>
        <div className={styles.textSecondary} style={{ marginTop: 4 }}>
          开始时间：{moment(attendanceInfo.endTime).fromNow()}
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
                    current={2}
                  >
                    <Step title="创建签到" description={desc1} />
                    <Step title="学生签到" description={desc2} />
                    <Step title="接收补签请求" description={desc3} />
                    <Step title="结束" />
                  </Steps>
                )}
              </RouteContext.Consumer>
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
