import { Button, Image, Result, Descriptions } from 'antd';
import React from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { StateType } from '../../model';
import styles from './index.less';
import QRCode  from 'qrcode.react';

interface Step3Props {
  qrcode?: StateType['qrcode'];
  data?: StateType['step'];
  dispatch?: Dispatch;
}

const Step3: React.FC<Step3Props> = (props) => {
  const { qrcode, data, dispatch } = props;
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
        <Image>
          <QRCode
            value={qrcode}
            size={200}
            fgColor="#000000"
          />
        </Image>
      </Descriptions>
    </div>
  );
  const extra = (
    <>
      <Button type="primary" onClick={onFinish}>
        返回
      </Button>
    </>
  );
  return (
    <Result
      status="success"
      title="操作成功"
      subTitle="学生扫描二维码可加入班级"
      extra={extra}
      className={styles.result}
    >
      {information}
    </Result>
  );
};

export default connect(({ classAndStepForm }: { classAndStepForm: StateType }) => ({
  data: classAndStepForm.step,
  qrcode: classAndStepForm.qrcode,
}))(Step3);
