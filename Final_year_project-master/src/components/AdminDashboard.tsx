import React, { useState } from 'react';
import WorkerCrud from './WorkerCrud';
import MeterCrud from './MeterCrud';
import AdminSideBar from './AdminSideBar';
import InspectionCrud from './InspectionCrud';
import RoutineCrud from './RoutineCrud';
import useErrorNotifier from '../hooks/useErrorNotifier';
import Email from './Email';

const AdminDashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('WorkerCrud');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'WorkerCrud':
        return <WorkerCrud tab={'get'} />;
      case 'MeterCrud':
        return <MeterCrud tab={'get'} />;
      case 'WorkerCrud_add':
        return <WorkerCrud tab={'add'} />;
      case 'InspectionCrud':
        return <InspectionCrud tab={'get'} />;
      case 'RoutineCrud':
        return <RoutineCrud tab={'get'} />;
      case 'Email':
        return <Email/>
      default:
        return <WorkerCrud tab={'get'} />;
    }
  };
  useErrorNotifier({ stateName: 'admin' });
  return (
    <div className="flex h-screen w-screen mt-20">
      <AdminSideBar selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} />

      <div className="flex-grow p-6 ml-60 scroll_none" >
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
