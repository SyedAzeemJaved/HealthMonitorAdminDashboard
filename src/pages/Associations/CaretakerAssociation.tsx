import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '@context';
import { PatientProps, FireToastEnum, UserContextProps } from '@types';

import { fireToast } from '@hooks';
import { Breadcrumb } from '@components';

import { constants } from '@constants';

type CaretakerAssociationProps = {
  patient_id: number;
};

export default function CaretakerAssociation() {
  const { id } = useParams();

  const { user, setLoading } = useContext(AuthContext) as UserContextProps;

  const [association, setAssociation] = useState<CaretakerAssociationProps>({
    patient_id: 0,
  });

  const [currentCaretakerPatients, setCurrentCaretakerPatients] = useState<
    PatientProps[]
  >([]);
  const [allPatients, setAllPatients] = useState<PatientProps[]>([]);

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();

      if (!association.patient_id) {
        throw new Error('Please fill all input fields');
      }

      setLoading(true);

      const res = await fetch(
        `${constants.ASSOCIATE}/caretaker?patient_id=${association.patient_id}&caretaker_id=${id}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      const response = await res.json();

      if (res.status !== 200)
        throw new Error(
          typeof response?.detail === 'string'
            ? response.detail
            : 'Something went wrong',
        );

      fireToast('Success', 'Associated successfully', FireToastEnum.SUCCESS);
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

  const fetchCurrentCaretakerPatients = async () => {
    try {
      const res = await fetch(constants.CARETAKERS + `/${id}`, {
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

      setCurrentCaretakerPatients(response.patients);
    } catch (err: any) {
      fireToast(
        'There seems to be a problem',
        err.message,
        FireToastEnum.DANGER,
      );
    }
  };

  const fetchAllPatients = async () => {
    try {
      const res = await fetch(constants.PATIENTS, {
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

      const patientArr: PatientProps[] = response.items.map(
        (patient: PatientProps) => {
          return {
            id: patient.id,
            name: patient.name,
            email: patient.email,
            gender: patient.gender,
            user_role: 'patient',
            created_at_in_utc: patient.created_at_in_utc,
            updated_at_in_utc: patient.updated_at_in_utc,
            additional_details: {
              phone: patient.additional_details.phone,
              age: patient.additional_details.age,
              blood_group: patient.additional_details.blood_group,
            },
            caretakers: patient.caretakers,
            doctors: patient.doctors,
          };
        },
      );

      setAllPatients(patientArr);
    } catch (err: any) {
      fireToast(
        'There seems to be a problem',
        err.message,
        FireToastEnum.DANGER,
      );
    }
  };

  useEffect(() => {
    fetchCurrentCaretakerPatients();
    fetchAllPatients();

    return () => {};
  }, []);

  return (
    <>
      <Breadcrumb pageName="Associate Patient" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Association
          </h3>
        </div>
        <div className="p-6.5">
          <form action="#">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Patients
              </label>
              <div className="relative z-20 bg-transparent dark:bg-meta-4">
                <select
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-gray px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  name="patient_id"
                  id="patient_id"
                  value={association.patient_id}
                  onChange={(e) => {
                    setAssociation((prev) => ({
                      ...prev,
                      patient_id: parseInt(e.target.value),
                    }));
                  }}
                >
                  <option value="0">Select patient</option>
                  {allPatients.map((patient: PatientProps) => {
                    const isFound = currentCaretakerPatients.find(
                      (elem) => elem.id === patient.id,
                    );

                    if (!isFound) {
                      return (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      );
                    }
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

            <div className="flex justify-end gap-4.5">
              <button
                className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
              >
                Cancel
              </button>
              <button
                className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:shadow-1"
                type="button"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
