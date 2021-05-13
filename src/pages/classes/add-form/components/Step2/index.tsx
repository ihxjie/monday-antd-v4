import React from 'react';
import { Form, Alert, Button, Descriptions, Divider } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { StateType } from '../../model';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
interface Step2Props {
  data?: StateType['step'];
  dispatch?: Dispatch;
  submitting?: boolean;
}

const Step2: React.FC<Step2Props> = (props) => {
  const [form] = Form.useForm();
  const { data, dispatch, submitting } = props;
  if (!data) {
    return null;
  }
  const { validateFields, getFieldsValue } = form;
  const onPrev = () => {
    if (dispatch) {
      const values = getFieldsValue();
      dispatch({
        type: 'classAndStepForm/saveStepFormData',
        payload: {
          ...data,
          ...values
        },
      });
      dispatch({
        type: 'classAndStepForm/saveCurrentStep',
        payload: 'info',
      });
    }
  };
  const onValidateForm = async () => {
    const values = await validateFields();
    if (dispatch) {
      dispatch({
        type: 'classAndStepForm/submitStepForm',
        payload: {
          ...data,
          ...values
        },
      });
    }
  };

  const { clazzName, clazzDescription } = data;
  return (
    <Form
      {...formItemLayout}
      form={form}
      layout="horizontal"
      className={styles.stepForm}
      initialValues={{ password: '123456' }}
    >
      <Alert
        closable
        showIcon
        message="确认创建班级后将生成班级二维码，学生扫描二维码加入班级。"
        style={{ marginBottom: 24 }}
      />
      <Descriptions column={1}>
        <Descriptions.Item label="班级名称"> {clazzName} </Descriptions.Item>
        <Descriptions.Item label="班级简介"> {clazzDescription} </Descriptions.Item>
      </Descriptions>
      <Divider style={{ margin: '24px 0' }} />
      
      <Form.Item
        style={{ marginBottom: 8 }}
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: {
            span: formItemLayout.wrapperCol.span,
            offset: formItemLayout.labelCol.span,
          },
        }}
      >
        <Button type="primary" onClick={onValidateForm} loading={submitting}>
          提交
        </Button>
        <Button onClick={onPrev} style={{ marginLeft: 8 }}>
          上一步
        </Button>
      </Form.Item>
    </Form>
  );
};
export default connect(
  ({
    classAndStepForm,
    loading,
  }: {
    classAndStepForm: StateType;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    submitting: loading.effects['classAndStepForm/submitStepForm'],
    data: classAndStepForm.step,
  }),
)(Step2);
