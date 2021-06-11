import { 
  Badge, 
  Card, 
  Descriptions, 
  Button,
  Divider,
  Tag,
  Table, 
  Dropdown,
  Menu,
  Modal,
  DatePicker,
  message,
  Popconfirm,
  Space,
  Tooltip,
} from 'antd';
import moment from 'moment';
import {
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import React, { Component, Fragment, useState, useRef, useEffect } from 'react';
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
import { EllipsisOutlined } from '@ant-design/icons';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { DualAxes, G2 } from '@ant-design/charts';

import { PageContainer, RouteContext } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Dispatch, Link } from 'umi';
import { connect } from 'umi';
import type { ClazzDataType, Student, Attendance, AttendanceItem } from './data.d';
import { 
  addAttendance, 
  removeStudent, 
  removeAttendance, 
  queryStudentByClazzId, 
  queryAttendanceByClazzId, 
  queryAddressByKeyword, 
  finishClazz } from './service';

const ButtonGroup = Button.Group;

const handleFinishClazz = async (clazzId: string) => {
  const msg = await finishClazz({clazzId})
  message.warn(msg);
}
// const actionRef = useRef<ActionType>();
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: AttendanceItem) => {
  const hide = message.loading('正在添加');
  try {
    const msg = await addAttendance({ 
      ...fields
    });
    hide();
    message.success(msg)
    return true;

  } catch (error) {
    hide();
    message.error('签到发起失败，请重试！');
    return false;
  }
};

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const getPathName = (status: string) => {
  if (status == '1') {
    return '/classes/attendance/step1'
  }else if (status == '2') {
    return '/classes/attendance/step2'
  }else if (status == '3') {
    return '/classes/attendance/step3'
  }
  return '/classes/attendance/step4'
}

const AttendanceDualAxes: React.FC<{ clazzId: string }> = ( clazzId ) => {

  const [columnData, setColumnData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    columnFetch();
    lineFetch();
  }, []);
  const columnFetch = () => {
    fetch('/api/record/queryClazzColumn/' + clazzId.clazzId)
      .then((response) => response.json())
      .then((json) => {
        setColumnData(json);
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  const lineFetch = () => {
    fetch('/api/record/queryClazzLine/' + clazzId.clazzId)
      .then((response) => response.json())
      .then((json) => {
        setLineData(json);
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  var config = {
    data: [lineData, columnData],
    xField: 'name',
    yField: ['rate', 'count'],
    slider: {},
    limitInPlot: false,
    padding: [20, 20, 50, 20],
    meta: {
      name: {
        sync: false,
      },
      rate: {
        alias: '签到率'
      }
    },
    geometryOptions: [
      {
        geometry: 'line',
        smooth: true,
      },
      {
        geometry: 'column',
        isStack: true,
        seriesField: 'type',
        columnWidthRatio: 0.4,
      },
    ],
  };
  return <DualAxes {...config} />;
};

const StudentTable: React.FC<{ clazzId: any }> = ( {clazzId} ) => {

  const actionRef = useRef<ActionType>();
  const [info, setInfo] = useState<any>([]);

  const confirm = (studentId: string) => {
    handleRemoveStudent(studentId, clazzId);
  }
  
  function cancel(e) {
    message.error('😁 点错啦');
  }

  const handleRemoveStudent = async (studentId: string, clazzId: string) => {
    const hide = message.loading('正在移除');
    try {
      await removeStudent(
        studentId,
        clazzId,
      );
      hide();
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('移除失败请重试！');
      return false;
    }
  }

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
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title="确认移除该学生？"
          onConfirm={confirm.bind(this, record.userId)}
          onCancel={cancel}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip title="移除该学生">
            <a>
              移除
            </a>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<Student>
      headerTitle="学生"
      actionRef={actionRef}
      style={{ marginBottom: 24 }}
      pagination={{
        showQuickJumper: true,
        pageSize: 5,
      }}
      columns={student}
      request={async () => {
        const msg = await queryStudentByClazzId({ clazzId: clazzId });
        return {
          data: msg,
          success: true,
        }
      }}
      search={false}
      rowKey="userId"
    />
  )
}

const AttendanceTable: React.FC<{ clazzId: any }> = ( {clazzId} ) => {
  const actionRef = useRef<ActionType>();
  const [info, setInfo] = useState<any>([]);


  const confirm = (attendanceId: string) => {
    handleRemoveAttendance(attendanceId);
  }
  
  function cancel(e) {
    message.error('😁点错啦');
  }

  const handleRemoveAttendance = async (attendanceId: string) => {
    const hide = message.loading('正在移除');
    try {
      const res = await removeAttendance(
        attendanceId,
      );
      hide();
      message.info(res);
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('移除失败请重试！');
      return false;
    }
  }

  const attendance: ProColumns<Attendance>[] = [
    {
      title: '签到编号',
      dataIndex: 'attendanceId',
      key: 'attendanceId',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '签到方式',
      dataIndex: 'attendanceType',
      key: 'attendanceType',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        1: { text: '点击签到' },
        2: { text: '二维码签到' },
        3: { text: '地理位置签到' },
        4: { text: '人脸识别签到' },
        5: { text: '人脸+地理位置签到' },
        6: { text: '地理位置+二维码签到' },
      },
    },
    {
      title: '签到状态',
      dataIndex: 'status',
      key: 'status',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        1: { text: '未到签到时间', status: 'Default' },
        2: { text: '接收签到请求', status: 'Processing' },
        3: { text: '接收补签请求', status: 'Warning' },
        4: { text: '签到结束', status: 'Success' },
      },
    },
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        
        <Link to={{ pathname: getPathName(record.status), search: '?attendanceId=' + record.attendanceId}}>
          <a>详情</a>
        </Link>,
        <Divider type="vertical" />,
        <Popconfirm
          title="确认删除该签到？"
          onConfirm={confirm.bind(this, record.attendanceId)}
          onCancel={cancel}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip title="删除该签到">
            <a>
              移除
            </a>
          </Tooltip>
        </Popconfirm>
      ],
    },
  ];  
  
  // setTimeout(() =>{
  //   setInfo([{"label":"福建省","value":"B024F0U3LL"},{"label":"福建顺恒","value":"B024F0UFYE"},{"label":"福建省福州茶厂","value":"B024F00214"},{"label":"福建雪人股份有限公司","value":"B024F0607T"},{"label":"福建江阴国际","value":"B024F05OP4"},{"label":"福建六建集团(龙庭路)","value":"B024F01XO7"},{"label":"福建华科光电有限公司","value":"B024F0021A"},{"label":"福建省二建建设集团有限公司","value":"B0FFGG5TY5"},{"label":"福建永福电力设计股份有限公司","value":"B0FFG8CL2Z"},{"label":"福建省物资(集团)有限责任公司","value":"B024F01FVI"}])
  // }, 1000)
  return (
    <ProTable<Attendance>
      headerTitle="历史签到"
      actionRef={actionRef}
      style={{ marginBottom: 24 }}
      pagination={{
        showQuickJumper: true,
        pageSize: 5,
      }}
      request={async () => {
        const msg = await queryAttendanceByClazzId({ clazzId: clazzId });
        return {
          data: msg,
          success: true,
        }
      }}
      columns={attendance}
      rowKey="attendanceId"
      search={false}
      toolbar={{
        actions: [
          <ModalForm<{
            attendanceTime: Date[];
            attendanceType: string;
            attAccuracy: string;
          }>
            title="发起签到"
            trigger={
              <Button type="primary">
                <PlusOutlined />
                发起签到
              </Button>
            }
            modalProps={{
              onCancel: () => console.log('run'),
            }}
            onFinish={async (pValues) => {
              console.log("isreach:  ")
              // @ts-ignore
              console.log('kkkx: ', pValues, info, info.find(v => pValues.attPosition === v.value))
              // @ts-ignore
              const values = info.find(v => pValues.attPosition === v.value) && info.find(v => pValues.attPosition === v.value).fakeValue;
              console.log("value: ", values)
              // @ts-ignore
              pValues.attPosition = values;
              // console.log('kkk: ', values, pValues)
              const success = await handleAdd(pValues as AttendanceItem);
              if(success){  
                actionRef.current.reload();
              }
              return true;
            }}
          >
            <ProForm.Group>
              <ProFormText name="clazzId" width="md" disabled label="班级id" initialValue={clazzId} />
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
                width="md"
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
                width="md"
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
                rules={[
                  {
                    required: true,
                    message: '请选择签到方式',
                  }
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                width="md"
                name="attPosition"
                label="签到位置"
                showSearch
                request={async ({ keyWords }) => {
                  await waitTime(1000);
                  let items = await queryAddressByKeyword({keyword: keyWords});
                  items = items.map(v => ({
                    label: v.label,
                    value: v.label,
                    fakeValue: v.value
                  }))
                  setInfo(items);
                  return items;
                }}
                rules={[
                  {
                    required: false,
                    message: '请选择签到位置',
                  }
                ]}
              />
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
                    required: false,
                    message: '请设置地理位置精度',
                  }
                ]}
              />
            </ProForm.Group>
          </ModalForm>
        ]
      }}
    />
    
  )
}


interface BasicProps {
  attendanceLoading: boolean;
  studentLoading: boolean;
  dispatch: Dispatch;
  location: any;
  clazz: ClazzDataType;
}
interface BasicState {
  visible: boolean;
}

class Basic extends Component<BasicProps, BasicState> {
  private timer = null;
  componentDidMount() {
    const { dispatch } = this.props;
    const clazzId = this.props.location.query.clazzId
    // this.timer = setInterval(()=>{
    //   dispatch({
    //     type: 'clazz/fetchStudent',
    //     payload: {
    //       clazzId: clazzId
    //     }
    //   });
    // }, 5000)

    dispatch({
      type: 'clazz/fetchClazzInfo',
      payload: {
        clazzId: clazzId
      }
    });
  }
  componentWillUnmount(){
    if(this.timer != null){
      clearInterval(this.timer)
    }
  }

  getClazzStatus(text: string){
    if(text == '0'){
      return "班级进行中";
    }
    return "班级已结束";
  }
  
  render() {
    const { clazz } = this.props;
    const { clazzInfo } = clazz;
    // console.error("students: ", students)
    const clazzId = this.props.location.query.clazzId

    const action = (
      <RouteContext.Consumer>
        {() => {
          return (
            <Fragment>
              
              <ButtonGroup>
                <Button danger type="primary" onClick={handleFinishClazz.bind(this, clazzId)}>解散班级</Button>
              </ButtonGroup>
            </Fragment>
          );
        }}
      </RouteContext.Consumer>
    );

    return (
      <PageContainer>
        <Card 
          bordered={false}
          extra={action}
          style={{ marginBottom: 24 }}
        >
          <Descriptions title="班级信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="班级名称">{clazzInfo.clazzName}</Descriptions.Item>
            <Descriptions.Item label="教师">{clazzInfo.clazzTeacher}</Descriptions.Item>
            <Descriptions.Item label="班级状态">
              {this.getClazzStatus(clazzInfo.isFinish)}
            </Descriptions.Item>
            <Descriptions.Item label="班级简介">{clazzInfo.clazzDescription}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          
          <AttendanceTable clazzId={clazzId} />

          <Divider style={{ marginBottom: 32 }} />
          
          <StudentTable clazzId={clazzId}/>

        </Card>

        <Card title="学生签到次数与签到率统计图">
          <AttendanceDualAxes clazzId={clazzId} />
        </Card>
      </PageContainer>
      
    );
  }
}

export default connect(
  ({
    clazz,
    loading,
  }: {
    clazz: ClazzDataType;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    clazz,
    studentLoading: loading.effects['clazz/fetchStudent'],
    attendanceLoading: loading.effects['clazz/fetchAttendance'],
  }),
)(Basic);
