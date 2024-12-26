import React, { useState } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
interface AdminSideBarProps {
  selectedComponent: string;
  setSelectedComponent: (component: string) => void;
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({ selectedComponent, setSelectedComponent }) => {
  return (
    <div className="bg-gray-800 text-white flex flex-col fixed left-0 h-full py-2" style={{ width: '15%', overflowY: 'hidden', margin: '0 auto', }}>
      <ul className="flex flex-col flex-grow gap-2">
        {/* Worker */}
        <li
          className={`flex items-center p-4 font-bold cursor-pointer hover:bg-gray-600 ${selectedComponent === 'WorkerCrud' ? 'bg-gray-700' : ''
            }`}
          onClick={() => setSelectedComponent('WorkerCrud')}
        >
          <PeopleIcon className='mr-3' />
          <span>Workers</span>
        </li>

        {/* Meter */}
        <li
          className={`flex items-center p-4 font-bold cursor-pointer hover:bg-gray-600 ${selectedComponent === 'MeterCrud' ? 'bg-gray-700' : ''
            }`}
          onClick={() => setSelectedComponent('MeterCrud')}
        >
          <SpeedIcon className="mr-3" />
          <span>Meter</span>
        </li>

        <li
          className={`flex items-center p-4 font-bold cursor-pointer hover:bg-gray-600 ${selectedComponent === 'AdminAnalysis' ? 'bg-gray-700' : ''
            }`}
          onClick={() => setSelectedComponent('InspectionCrud')}
        >
          <VerifiedIcon className="mr-3" />
          <span>Inspections</span>
        </li>

        <li
          className={`flex items-center p-4 font-bold cursor-pointer hover:bg-gray-600 ${selectedComponent === 'AdminAnalysis' ? 'bg-gray-700' : ''
            }`}
          onClick={() => setSelectedComponent('RoutineCrud')}
        >
          <AlarmOnIcon className="mr-3" />
          <span>Routine</span>
        </li>
        <li
          className={`flex items-center p-4 font-bold cursor-pointer hover:bg-gray-600 ${selectedComponent === 'AdminAnalysis' ? 'bg-gray-700' : ''
            }`}
          onClick={() => setSelectedComponent('Email')}
        >
          <EmailIcon className="mr-3" />
          <span>Email</span>
        </li>
      </ul>
    </div>
  );
};

export default AdminSideBar;
