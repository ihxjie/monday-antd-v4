import { 
  Badge, 
  Card, 
  Descriptions, 
  Button,
  Divider, 
  Table, 
  Dropdown,
  Menu,
  Modal,
  message,
} from 'antd';
import {
  DownOutlined,
} from '@ant-design/icons';
import React, { Component, Fragment, useState, useRef } from 'react';

import { PageContainer, RouteContext } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Dispatch, Link } from 'umi';
import { connect } from 'umi';
import type { ClazzDataType, Student } from './data.d';

import styles from './style.less';

const ButtonGroup = Button.Group;

const mobileMenu = (
  <Menu>
    <Menu.Item key="1">解散班级</Menu.Item>
  </Menu>
);

const handleEdit = (item) => {
  console.log('test: ', item)
}
const action = (
  <RouteContext.Consumer>
    {({ isMobile }) => {
      if (isMobile) {
        return (
          <Dropdown.Button
            type="primary"
            icon={<DownOutlined />}
            overlay={mobileMenu}
            placement="bottomRight"
          >
            发起签到
          </Dropdown.Button>
        );
      }
      return (
        <Fragment>
          <ButtonGroup>
            <Button type="primary">发起签到</Button>
            <Button onClick={handleEdit.bind(this, '123')}>解散班级</Button>
            
          </ButtonGroup>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);

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
  componentDidMount() {
    const { dispatch } = this.props;
    const clazzId = this.props.location.query.clazzId

    dispatch({
      type: 'clazz/fetchClazzInfo',
      payload: {
        clazzId: clazzId
      }
    });

    dispatch({
      type: 'clazz/fetchAttendance',
      payload: {
        clazzId: clazzId
      }
    });

    dispatch({
      type: 'clazz/fetchStudent',
      payload: {
        clazzId: clazzId
      }
    });
  }
  render() {
    const { clazz, attendanceLoading, studentLoading } = this.props;
    const { attendances, students, clazzInfo } = clazz;
    console.error("students: ", students)

    

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
    ];
    const attendance = [
      {
        title: '签到编号',
        dataIndex: 'attendanceId',
        key: 'attendanceId',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
      },
      {
        title: '签到方式',
        dataIndex: 'attendanceType',
        key: 'attendanceType',
        render: (text: string) => {
          if (text == '1') {
            return <Badge status="processing" text="点击签到" />;
          }else if (text == '2') {
            return <Badge status="processing" text="二维码签到" />;
          }else if (text == '3') {
            return <Badge status="processing" text="地理位置签到" />;
          }else if (text == '4') {
            return <Badge status="processing" text="人脸识别签到" />;
          }else if (text == '5') {
            return <Badge status="processing" text="人脸+地理位置签到" />;
          }else if (text == '6') {
            return <Badge status="processing" text="地理位置+二维码签到" />;
          }
          return <Badge status="error" text="未定义" />;
        },
      },
    ];

    return (
      <PageContainer>
        <Card 
          bordered={false}
          extra={action}
        >
          <Descriptions title="班级信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="班级名称">{clazzInfo.clazzName}</Descriptions.Item>
            <Descriptions.Item label="教师">{clazzInfo.clazzTeacher}</Descriptions.Item>
            <Descriptions.Item label="班级状态">
              {clazzInfo.isFinish}
            </Descriptions.Item>
            <Descriptions.Item label="班级简介">{clazzInfo.clazzDescription}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          
          <div className={styles.title}>历史签到</div>
          
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={attendanceLoading}
            dataSource={attendances}
            columns={attendance}
            rowKey="id"
          />
          <Divider style={{ marginBottom: 32 }} />

          <div className={styles.title}>学生</div>
          
          <ProTable<Student>
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={studentLoading}
            dataSource={students}
            columns={student}
            toolbar={[]}
            search={false}
            rowKey="id"
          />
          
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
