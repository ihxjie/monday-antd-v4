import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
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
  message,
  Table,
  Tooltip,
  Empty,
} from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateTimePicker,
  ProFormDateRangePicker,
  ProFormSlider,
  ProFormSwitch,
  ProFormDateTimeRangePicker,
  ProFormSelect,
} from '@ant-design/pro-form';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { AttendanceDataType, AttendanceItem, AttendanceInfo } from './data.d';
import styles from './style.less';
import { updateAttendance } from './service';

const { Step } = Steps;
const ButtonGroup = Button.Group;

const menu = (
  <Menu>
    <Menu.Item key="1">选项一</Menu.Item>
    <Menu.Item key="2">选项二</Menu.Item>
    <Menu.Item key="3">选项三</Menu.Item>
  </Menu>
);

const action = (
  <RouteContext.Consumer>
    {({ }) => {
      
      return (
        <Fragment>
          <Button type="primary">取消并删除签到</Button>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);

const extra = (
  <Statistic title="状态" value="签到发布" />
);

const popoverContent = (
  <div style={{ width: 160 }}>
    吴加号
    <span className={styles.textSecondary} style={{ float: 'right' }}>
      <Badge status="default" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{ marginTop: 4 }}>
      耗时：2小时25分钟
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

const handleUpdate = async (fields: AttendanceItem) => {
  const hide = message.loading('正在修改');
  try {
    await updateAttendance({ 
      ...fields
    });
    hide();
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};


interface AdvancedProps {
  loading: boolean; 
  attendance: AttendanceDataType; 
  dispatch: Dispatch; 
  location: any; 
}

interface AdvancedState {
  operationKey: string;
  tabActiveKey: string;
}

class Advanced extends Component<AdvancedProps, AdvancedState> {
  public state: AdvancedState = {
    operationKey: 'tab1',
    tabActiveKey: 'detail',
  };

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
  getAttendanceId(text: string) {
    return "签到编号：" + text;
  }

  render() {
    const { attendance } = this.props;
    const { attendanceInfo } = attendance;
    const attendanceId = this.props.location.query.attendanceId
    

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

    const desc1 = (
      <div className={classNames(styles.textSecondary, styles.stepDescription)}>
        <div>{attendanceInfo.createdAt}</div>
      </div>
    );

    return (
      <PageContainer
        title={this.getAttendanceId(attendanceInfo.attendanceId)}
        extra={action}
        className={styles.pageHeader}
        extraContent={extra}
        content={description}
      >
        <div className={styles.main}>
          <GridContent>
            <Card title="签到进度" style={{ marginBottom: 24 }}>
              <RouteContext.Consumer>
                {({ isMobile }) => (
                  <Steps
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    progressDot={customDot}
                    current={0}
                  >
                    <Step title="创建签到" description={desc1} />
                    <Step title="学生签到" />
                    <Step title="接收补签请求" />
                    <Step title="结束" />
                  </Steps>
                )}
              </RouteContext.Consumer>
            </Card>
            <Card title="重新设置签到信息" style={{ marginBottom: 24 }} bordered={false}>
              <ProForm
                name="form"
                onValuesChange={(_, values) => {
                  console.log(values);
                }}
                onFinish={async (values) => {
                  const success = await handleUpdate(values as AttendanceItem);
                  console.log(success)
                  if(success){
                    message.success('签到发起成功');
                  }else{
                    message.error('签到发起失败');
                  }
                  return true;
                }}
              >
                <ProFormText name="attendanceId" hidden initialValue={attendanceInfo.attendanceId} />
                <ProFormText name="clazzId" hidden initialValue={attendanceInfo.clazzId} />
                <ProForm.Group>
                  <ProFormSwitch 
                    name="subscribe"
                    tooltip="预约签到将会在签到前5分钟提醒学生"
                    label="预约签到" />
                  
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormDateTimeRangePicker
                    fieldProps={{
                      ranges: {
                        '5分钟': [moment(), moment().add(5, 'minute')],
                        '10分钟': [moment(), moment().add(10, 'minute')],
                        '15分钟': [moment(), moment().add(15, 'minute')],
                      },
                      showTime: true,
                      format: "YYYY/MM/DD HH:mm:ss"
                    }}
                    width="lg"
                    name="attendanceTime" 
                    label="签到起止时间"
                    rules={[
                      {
                        required: true,
                        message: '请设置签到起止时间',
                      }
                    ]}
                  />
                  
                  <ProFormSelect
                    options={[
                      { label: '点击签到', value: '1' },
                      { label: '二维码签到', value: '2' },
                      { label: '地理位置签到', value: '3' },
                      { label: '人脸识别签到', value: '4' },
                      { label: '人脸+地理位置签到', value: '5' },
                      { label: '地理位置+二维码签到', value: '6' },
                    ]}
                    name="attendanceType"
                    label="签到方式"
                    width="md"
                    rules={[
                      {
                        required: true,
                        message: '请选择签到方式',
                      }
                    ]}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormSlider
                    name="attAccuracy"
                    label="设置地理位置精度"
                    width="md"
                    marks={{
                      25: '25m',
                      50: '50m',
                      75: '75m',
                      100: '100m',
                    }}
                    rules={[
                      {
                        required: true,
                        message: '请设置地理位置精度',
                      }
                    ]}
                  />
                </ProForm.Group>
              </ProForm>
            </Card>
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
    loading: loading.effects['attendance/fetchAttendanceInfo'],
  }),
)(Advanced);
