import { Button, Result, Descriptions } from 'antd';
import React from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { StateType } from '../../model';
import styles from './index.less';

interface Step3Props {
  data?: StateType['step'];
  dispatch?: Dispatch;
}

const Step3: React.FC<Step3Props> = (props) => {
  const { data, dispatch } = props;
  if (!data) {
    return null;
  }
  const { clazzName, clazzDescription } = data;
  const onFinish = () => {
    if (dispatch) {
      dispatch({
        type: 'classAndStepForm/saveCurrentStep',
        payload: 'info',
      });
    }
  };
  const information = (
    <div className={styles.information}>
      <Descriptions column={1}>
        <Descriptions.Item label="班级名称"> {clazzName}</Descriptions.Item>
        <Descriptions.Item label="班级简介"> {clazzDescription}</Descriptions.Item>
      </Descriptions>
    </div>
  );
  const extra = (
    <>
      <Button type="primary" onClick={onFinish}>
        再转一笔
      </Button>
      <Button>查看账单</Button>
    </>
  );
  return (
    <Result
      status="success"
      title="操作成功"
      subTitle="预计两小时内到账"
      extra={extra}
      className={styles.result}
    >
      {information}
    </Result>
  );
};

export default connect(({ classAndStepForm }: { classAndStepForm: StateType }) => ({
  data: classAndStepForm.step,
}))(Step3);
