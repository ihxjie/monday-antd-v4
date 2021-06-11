import { DingdingOutlined } from '@ant-design/icons';
import { Button, Card, Image, Result, Descriptions } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import React, { Fragment, Component, useEffect, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import styles from './index.less';
import QRCode  from 'qrcode.react';
import type { Dispatch } from 'umi';
import type { AttendanceDataType } from './data.d';

const QrCodeImage: React.FC<{ attendanceId: string }> = (attendanceId) => {
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
    fetch('/api/attendance/getDynamicQrcode/' + attendanceId.attendanceId)
      .then((response) => response.text())
      .then((text) => {
        //@ts-ignore
        setData(text);
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  console.log("att: ")

  var config = {
    width: 400,
    src: data.toString()
  };

  return(
    <Image {...config} />
  )
};


interface QrcodeState {
  operationKey: string;
  tabActiveKey: string;
}

interface QrcodeProps {
  attendance: AttendanceDataType; 
  dispatch: Dispatch; 
  location: any; 
}

class QrcodeClass extends Component<QrcodeProps, QrcodeState> {
  render() {
    const attendanceId = this.props.location.query.attendanceId

    return (
      <GridContent>
        <Card bordered={false}>
          <Result
            status="success"
            title="点击二维码图片即可放大"
            className={styles.result}
          >
            <div className={styles.viewer}>
              <QrCodeImage attendanceId={attendanceId} />
            </div>
          </Result>
        </Card>
      </GridContent>
    )
  }

}

export default (QrcodeClass);
