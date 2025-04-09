'use client';
import React, { useEffect, useState } from 'react';
import { Table, Tag, Image, Spin } from 'antd';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';

interface VideoAnalytics {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  visits: number;
  isBlocked: boolean;
  safety_rating: string;
}

interface UrlAnalytics {
  id: string;
  url: string;
  isBlocked: boolean;
  safety_rating: string;
  explanation: string;
}

const Page = () => {
  const [videoData, setVideoData] = useState<VideoAnalytics[]>([]);
  const [urlData, setUrlData] = useState<UrlAnalytics[]>([]);
  const [loadingVideo, setLoadingVideo] = useState<boolean>(false);
  const [loadingUrl, setLoadingUrl] = useState<boolean>(false);

 
  useEffect(() => {
    const fetchVideoAnalytics = async () => {
      setLoadingVideo(true);
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) throw new Error('Failed to fetch video analytics');
        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        console.error('Video fetch error:', err);
        toast.error('Failed to load video data');
      } finally {
        setLoadingVideo(false);
      }
    };

    fetchVideoAnalytics();
  }, []);

  
  useEffect(() => {
    const fetchUrlAnalytics = async () => {
      setLoadingUrl(true);
      try {
        const response = await fetch('/api/url-analytics');
        if (!response.ok) throw new Error('Failed to fetch URL analytics');
        const data = await response.json();
        setUrlData(data);
      } catch (err) {
        console.error('URL fetch error:', err);
        toast.error('Failed to load URL data');
      } finally {
        setLoadingUrl(false);
      }
    };

    fetchUrlAnalytics();
  }, []);

 
  const handleVideoDelete = async (id: string) => {
    try {
      const response = await fetch('/api/delete-video', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setVideoData(prev => prev.filter(video => video.id !== id));
        toast.success('Video deleted successfully');
      } else {
        toast.error('Failed to delete video');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Error deleting video');
    }
  };
  const handleUrlDelete = async (id: string) => {
    try {
      const response = await fetch('/api/url-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        setUrlData(prev => prev.filter(url => url.id !== id));
        toast.success('URL deleted successfully');
      } else {
        toast.error('Failed to delete URL');
      }
    } catch (err) {
      console.error('URL Delete error:', err);
      toast.error('Error deleting URL');
    }
  };
  

  const videoColumns = [
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
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Visits', dataIndex: 'visits', key: 'visits' },
    {
      title: 'Blocked',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (blocked: boolean) => (
        <Tag color={blocked ? 'red' : 'green'}>{blocked ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Safety Rating',
      dataIndex: 'safety_rating',
      key: 'safety_rating',
      render: (rating: string) => (
        <Tag color={rating === 'Safe' ? 'green' : 'red'}>{rating}</Tag>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_: string, record: VideoAnalytics) => (
        <Trash
          className="text-red-500 cursor-pointer"
          onClick={() => handleVideoDelete(record.id)}
        />
      ),
    },
  ];

  const urlColumns = [
    { title: 'URL', 
      dataIndex: 'url', 
      key: 'url',
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {url}
        </a>
      ),
     },
    {
      title: 'Blocked',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (blocked: boolean) => (
        <Tag color={blocked ? 'red' : 'green'}>{blocked ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Safety Rating',
      dataIndex: 'safety_rating',
      key: 'safety_rating',
      render: (rating: string) => (
        <Tag color={rating === 'Safe' ? 'green' : 'red'}>{rating}</Tag>
      ),
    },
    { title: 'Explanation', dataIndex: 'explanation', key: 'explanation' },
    {
      title: 'Delete',
      key: 'delete',
      render: (_: string, record: UrlAnalytics) => (
        <Trash
          className="text-red-500 cursor-pointer"
          onClick={() => handleUrlDelete(record.id)}
        />
      ),
    },
  ];
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold underline text-center text-gray-700 mb-6">Analytics</h1>

      
      <h2 className="text-xl font-semibold mb-4 text-center">Video Data</h2>
      <Table
        dataSource={videoData}
        columns={videoColumns}
        rowKey={record => record.id}
        pagination={{ pageSize: 3 }}
        bordered
        locale={{ emptyText: loadingVideo ? <Spin /> : 'No Videos Found' }}
      />

      <h2 className="text-xl font-semibold mt-10 mb-4 text-center">URL Data</h2>
      <Table
        dataSource={urlData}
        columns={urlColumns}
        rowKey={record => record.id}
        pagination={{ pageSize: 3 }}
        bordered
        locale={{ emptyText: loadingUrl ? <Spin /> : 'No URLs Found' }}
      />
    </div>
  );
};

export default Page;
