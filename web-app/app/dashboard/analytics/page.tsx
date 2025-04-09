'use client';
import React, { useEffect, useState } from 'react';
import { Table, Tag, Image, Spin } from 'antd';

import {  message } from 'antd';
import {  Trash } from 'lucide-react';


interface VideoAnalytics {
  url: string,
  id: string;
  title: string;
  thumbnail: string;
  visits: number;
  isBlocked: boolean;
  safety_rating: string;
}


const Page = () => {
  const [data, setData] = useState<VideoAnalytics[]>([]);
  const [loading,setLoading]=useState<boolean>(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/analytics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/delete-video', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        setData(prev => prev.filter(video => video.id !== id));
        message.success('Video deleted');
      } else {
        message.error('Failed to delete video');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Error deleting video');
    }
  };
  

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (_: string, record: VideoAnalytics) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer">
          <Image src={record.thumbnail} alt="Thumbnail" width={80} height={50} preview={false} />
        </a>
      ),
    },
    
    
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Visits',
      dataIndex: 'visits',
      key: 'visits',
      
    },
    {
      title: 'Blocked',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (blocked: boolean) => (
        <Tag color={blocked ? 'red' : 'green'}>
          {blocked ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Safety Rating',
      dataIndex: 'safety_rating',
      key: 'safety_rating',
      render: (rating: string) => (
        <Tag color={rating === 'Safe' ? 'green' : 'red'} >
          {rating === 'Safe' ? 'Safe' : 'Caution'}
        </Tag>
      ),
      
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_: string, record: VideoAnalytics) => (
     
        /*<Popconfirm
          title="Are you sure to delete this video?"
          onConfirm={() => handleDelete(record.id)} 
          okText="Yes"
          cancelText="No"
        >*/
          <Trash className='text-red-500 cursor-pointer' 
          onClick={() => handleDelete(record.id)}/>
       // </Popconfirm>
      ),
    },
    
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center underline ">Analytics</h1>
      <h2 className="text-xl font-semibold mb-4 text-center">Video Data</h2>
      <Table 
        locale={
          {
            emptyText:loading? <Spin />: ""
          }
        }
        dataSource={data}
        columns={columns}
        rowKey={(record) => record.id}

        pagination={{ pageSize: 3}}
        bordered
      />
    </div>
  );
};

export default Page;
