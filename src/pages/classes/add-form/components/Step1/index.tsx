import React from 'react';
import { Form, Button, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { StateType } from '../../model';
import styles from './index.less';
import TextArea from 'antd/lib/input/TextArea';


const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
interface Step1Props {
  data?: StateType['step'];
  dispatch?: Dispatch;
}

const Step1: React.FC<Step1Props> = (props) => {
  const { dispatch, data } = props;
  const [form] = Form.useForm();

  if (!data) {
    return null;
  }
  const { validateFields } = form;
  const onValidateForm = async () => {
    const values = await validateFields();
    console.log(values)
    if (dispatch) {
      dispatch({
        type: 'classAndStepForm/saveStepFormData',
        payload: values,
      });
      dispatch({
        type: 'classAndStepForm/saveCurrentStep',
        payload: 'confirm',
      });

    }
  };
  const uploadprops = {
    action: '/api/testFile',
    maxCount: 1,
    onChange(info) {
      console.log(info)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };
  
  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        hideRequiredMark
        initialValues={data}
      >
        <Form.Item
          label="班级名称"
          name="clazzName"
          rules={[{ required: true, message: '请输入班级名称' }]}
        >
          <Input placeholder="请输入班级名称" />
        </Form.Item>
        <Form.Item
          label="班级简介"
          name="clazzDescription"
          rules={[{ required: true, message: '请输入班级简介[例如：2020-土木工程]' }]}
        >
          <TextArea placeholder="请输入班级简介[例如：2020-土木工程]" autoSize={{ minRows: 4, maxRows: 6 }} />
        </Form.Item>
        <Form.Item
          label="班级LOGO"
          name="clazzLogo"
        >
          <Upload {...uploadprops}>
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default connect(({ classAndStepForm }: { classAndStepForm: StateType }) => ({
  data: classAndStepForm.step,
}))(Step1);
