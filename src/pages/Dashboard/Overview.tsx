import { useState, useContext, useEffect } from 'react';

import { AuthContext } from '@context';

import { UserContextProps, FireToastEnum } from '@types';

import { fireToast } from '@hooks';
import { Card } from '@components';

import { constants } from '@constants';

interface DashboardOverviewProps {
  admin_count: string | number;
  caretaker_count: string | number;
  doctor_count: string | number;
  patient_count: string | number;
}

const Overview = () => {
  const { user } = useContext(AuthContext) as UserContextProps;

  const [dashboardData, setDashboardData] = useState<DashboardOverviewProps>({
    admin_count: 'Fetching',
    caretaker_count: 'Fetching',
    doctor_count: 'Fetching',
    patient_count: 'Fetching',
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(constants.STATS, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const response = await res.json();

      if (res.status !== 200)
        throw new Error(
          typeof response?.detail === 'string'
            ? response.detail
            : 'Something went wrong',
        );

      setDashboardData({
        admin_count: response.admin_count,
        caretaker_count: response.caretaker_count,
        doctor_count: response.doctor_count,
        patient_count: response.patient_count,
      });
    } catch (err: any) {
      fireToast(
        'There seems to be a problem',
        err.message,
        FireToastEnum.DANGER,
      );
    }
  };

  useEffect(() => {
    fetchStats();

    return () => {};
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <Card title="Total Admins" description={dashboardData.admin_count} />
        <Card
          title="Total Caretakers"
          description={dashboardData.caretaker_count}
        />
        <Card title="Total Doctors" description={dashboardData.doctor_count} />
        <Card
          title="Total Patients"
          description={dashboardData.patient_count}
        />
      </div>
    </>
  );
};

export default Overview;
