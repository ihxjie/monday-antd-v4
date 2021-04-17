import React, { useState, useEffect } from 'react';
import { Card, Steps } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import type { StateType } from './model';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import styles from './style.less';

const { Step } = Steps;

interface StepFormProps {
  current: StateType['current'];
}

const getCurrentStepAndComponent = (current?: string) => {
  switch (current) {
    case 'confirm':
      return { step: 1, component: <Step2 /> };
    case 'result':
      return { step: 2, component: <Step3 /> };
    case 'info':
    default:
      return { step: 0, component: <Step1 /> };
  }
};

const StepForm: React.FC<StepFormProps> = ({ current }) => {
  const [stepComponent, setStepComponent] = useState<React.ReactNode>(<Step1 />);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent(current);
    setCurrentStep(step);
    setStepComponent(component);
  }, [current]);

  return (
    <PageContainer content="本指引将协助完成创建班级任务。">
      <Card bordered={false}>
        <>
          <Steps current={currentStep} className={styles.steps}>
            <Step title="填写班级信息" />
            <Step title="确认班级信息" />
            <Step title="完成" />
          </Steps>
          {stepComponent}
        </>
      </Card>
    </PageContainer>
  );
};

export default connect(({ classAndStepForm }: { classAndStepForm: StateType }) => ({
  current: classAndStepForm.current,
}))(StepForm);
