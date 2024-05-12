"use client";

import { bitable } from '@lark-base-open/js-sdk'
import { Upload, type UploadProps, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Dragger } = Upload;

const supportedFieldTypes = [1, 2, 5, 13, 99005];

export default function Home() {
  const [tableFields, setTableFields] = useState('');

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload',
    accept: '.pdf',
    data: {
      tableFields,
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        bitable.base.getActiveTable().then(async (table) => {
          await table.addRecord({
            fields: info.file.response.fields
          })
        })
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  useEffect(() => {
    loadTable();
  }, []);

  async function loadTable() {
    const table = await bitable.base.getActiveTable();
    const fields = await table.getFieldMetaList();
    console.log(fields);
    table.getRecords({}).then((records) => {
      console.log(records);
    });
    setTableFields(JSON.stringify(fields.filter(f => supportedFieldTypes.includes(f.type))));
  }
  

  return (
    <div className='p-4'>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
    </Dragger>
    </div>
  );
}