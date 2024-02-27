import { useState, useContext } from 'react';

import { AuthContext } from '@context';
import { UserContextProps } from '@types';

import { fireToast } from '@hooks';
import { Breadcrumb } from '@components';

import { FireToastEnum } from '@types';
import { constants } from '@constants';

type CreatePatientProps = {
  name: string;
  email: string;
  gender: 'male' | 'female' | 'rather_not_say';
  password: string;
  confirm_password: string;
};

export default function AddPatient() {
  const { user, setLoading } = useContext(AuthContext) as UserContextProps;

  const [patient, setPatient] = useState<CreatePatientProps>({
    name: '',
    email: '',
    gender: 'rather_not_say',
    password: '',
    confirm_password: '',
  });

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();

      if (!patient) {
        return;
      }

      if (!patient.name || !patient.email || !patient.password) {
        throw new Error('Please fill all input fields');
      }

      if (patient.password !== patient.confirm_password) {
        throw new Error('Passwords do not match');
      }

      setLoading(true);

      const res = await fetch(`${constants.USERS}`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          name: patient.name,
          email: patient.email,
          gender: patient.gender,
          user_role: 'patient',
          password: patient.password,
        }),
      });

      const response = await res.json();

      if (res.status !== 200)
        throw new Error(
          typeof response?.detail === 'string'
            ? response.detail
            : 'Something went wrong',
        );

      fireToast('Success', 'Patient added successfully', FireToastEnum.SUCCESS);
    } catch (err: any) {
      fireToast(
        'There seems to be a problem',
        err.message,
        FireToastEnum.DANGER,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add Patient" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Add a new patient to HealthMate
          </h3>
        </div>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter their full name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setPatient((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter their email address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setPatient((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Gender
              </label>
              <div className="relative z-20">
                <select
                  className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  onChange={(e) => {
                    setPatient((prev) => ({
                      ...prev,
                      gender: e.target.value === 'male' ? 'male' : 'female',
                    }));
                  }}
                >
                  <option value="rather_not_say">Select gender</option>
                  {[
                    { id: 1, k: 'Male', v: 'male' },
                    {
                      id: 2,
                      k: 'Female',
                      v: 'female',
                    },
                  ].map((item) => {
                    return (
                      <option key={item.id} value={item.v}>
                        {item.k}
                      </option>
                    );
                  })}
                </select>
                <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      ></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Password <span className="text-meta-1">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setPatient((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Re-type Password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setPatient((prev) => ({
                    ...prev,
                    confirm_password: e.target.value,
                  }));
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
