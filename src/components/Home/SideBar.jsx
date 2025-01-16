import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'lucide-react';
import ScheduleEmpty from '../../components/Sidebar/ScheduleEmpty';
import LinkedInLogo from '../../assests/images/settings/LinkedInLogo.svg';
import TwitterLogo from '../../assests/images/settings/TwitterIcon.svg';

const SocialCard = ({ platform }) => (
  <div
    style={{
      backgroundColor: platform.bgColor,
      height: '6rem',
    }}
    className="rounded-lg p-4 mb-3 text-white flex items-center"
  >
    <img
      src={platform.logo}
      alt={`${platform.name} logo`}
      className="w-10 h-10 rounded-full mr-3"
    />
    <div className="flex-1">
      <div className="flex flex-col">
        <span style={{ color: platform.textColor }} className="text-lg font-bold">
          {platform.name}
        </span>
        <span className="text-sm text-white">{platform.posts} Posts</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm text-white">@{platform.username.split(' ')[0].toLowerCase()}</span>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="w-[30rem] bg-[#1F1F1F] rounded-lg p-5 h-full">
    <h2 className="text-white text-lg font-medium mb-4">My Schedule</h2>
    <div className="text-white text-sm animate-pulse">Loading schedule data...</div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="w-[30rem] bg-[#1F1F1F] rounded-lg p-5 h-full">
    <h2 className="text-white text-lg font-medium mb-4">My Schedule</h2>
    <div className="text-red-500 text-sm">
      Unable to load schedule: {error}
    </div>
  </div>
);

const SideBar = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    const fetchStatusNumbers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/user/StatusNumber', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData.id // Make sure this matches your user ID field name
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch status numbers');
        }

        const result = await response.json();
        if (result.success) {
          setStatusData(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userData.id) {
      fetchStatusNumbers();
    }
  }, [userData.id]);

  const platforms = useMemo(() => {
    if (!statusData) return [];

    return [
      {
        name: 'LinkedIn',
        bgColor: '#0066C8',
        posts: statusData.linkedin || 0,
        textColor: 'black',
        username: userData.name || 'User',
        logo: LinkedInLogo,
      },
      {
        name: 'Twitter',
        bgColor: '#000000',
        textColor: 'white',
        posts: statusData.twitter || 0,
        username: userData.name || 'User',
        logo: TwitterLogo,
      },
    ].filter((platform) => statusData[platform.name.toLowerCase()] > 0);
  }, [statusData, userData.name]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="w-[30rem] bg-[#1F1F1F] rounded-lg p-5 h-full">
      <h2 className="text-white text-lg font-medium mb-4">My Schedule</h2>
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-hide">
        {platforms.length > 0 ? (
          platforms.map((platform, index) => (
            <SocialCard key={`${platform.name}-${index}`} platform={platform} />
          ))
        ) : (
          <ScheduleEmpty />
        )}
      </div>
    </div>
  );
};

export default SideBar;