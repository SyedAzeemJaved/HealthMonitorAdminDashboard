import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '@context';

import { UserContextProps, FireToastEnum } from '@types';

import { fireToast } from '@hooks';
import { Breadcrumb } from '@components';

import { constants } from '@constants';

import { nullIfEmpty, TimestampConverter } from '@utils';

type EditCaretakerProps = {
  id: number;
  name: string;
  email: string;
  gender: 'male' | 'female' | 'rather_not_say';
  created_at_in_utc: string;
  updated_at_in_utc: string | null;
  additional_details: {
    phone: string | null;
    age: number | null;
    blood_group:
      | 'A+'
      | 'A-'
      | 'AB+'
      | 'AB-'
      | 'B+'
      | 'B-'
      | 'O+'
      | 'O-'
      | 'Unknown';
  };
};

export default function EditCaretaker() {
  const { id } = useParams();

  const { user, setLoading } = useContext(AuthContext) as UserContextProps;

  const [caretaker, setCaretaker] = useState<EditCaretakerProps>({
    id: 0,
    name: '',
    email: '',
    gender: 'rather_not_say',
    created_at_in_utc: '',
    updated_at_in_utc: null,
    additional_details: {
      phone: null,
      age: null,
      blood_group: 'Unknown',
    },
  });

  const handleChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    setCaretaker((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleChangeAdditionalDetails = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    setCaretaker((prev) => ({
      ...prev,
      additional_details: {
        ...prev.additional_details,
        [target.name]: target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      e.preventDefault;

      if (!caretaker.name || !caretaker.email) {
        throw new Error('Please fill all required input fields');
      }

      setLoading(true);

      const res = await fetch(`${constants.USERS}/${id}`, {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          name: caretaker.name,
          email: caretaker.email,
          gender: caretaker.gender,
          additional_details: {
            phone: nullIfEmpty(caretaker.additional_details.phone),
            age: caretaker.additional_details.age,
            blood_group: caretaker.additional_details.blood_group,
          },
        }),
      });

      const response = await res.json();

      if (res.status !== 200)
        throw new Error(
          typeof response?.detail === 'string'
            ? response.detail
            : 'Something went wrong',
        );

      fireToast(
        'Success',
        'Caretaker edited successfully',
        FireToastEnum.SUCCESS,
      );
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

  const fetchCaretaker = async (id: number) => {
    try {
      const res = await fetch(`${constants.USERS}/${id}`, {
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

      setCaretaker({
        id: response.id,
        name: response.name,
        email: response.email,
        gender: response.gender,
        created_at_in_utc: response.created_at_in_utc,
        updated_at_in_utc: response.updated_at_in_utc,
        additional_details: {
          phone: response.additional_details.phone,
          age: response.additional_details.age,
          blood_group: response.additional_details.blood_group,
        },
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
    if (id) {
      fetchCaretaker(parseInt(id));
    }

    return () => {};
  }, [id]);

  return (
    <>
      <Breadcrumb pageName="Edit Caretaker" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Caretaker Information
          </h3>
        </div>
        <div className="p-7">
          <form action="#">
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="name"
                >
                  Name <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4.5 top-4">
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                          fill=""
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter name"
                    value={caretaker.name}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="email"
                >
                  Email
                  <span className="text-meta-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4.5 top-4">
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                          fill=""
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    value={caretaker.email}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Enter phone number"
                  value={caretaker.additional_details.phone || undefined}
                  onChange={(e) => handleChangeAdditionalDetails(e)}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="age"
                >
                  Age
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="number"
                  min={0}
                  step={1}
                  name="age"
                  id="age"
                  placeholder="Enter age"
                  value={caretaker.additional_details.age || undefined}
                  onChange={(e) => handleChangeAdditionalDetails(e)}
                />
              </div>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Blood Group
                </label>
                <div className="relative z-20 bg-transparent dark:bg-meta-4">
                  <select
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-meta-4 dark:focus:border-primary"
                    name="blood_group"
                    id="blood_group"
                    value={caretaker.additional_details.blood_group}
                    onChange={(e) => {
                      handleChangeAdditionalDetails(e);
                    }}
                  >
                    <option value="Unknown">Select blood group</option>
                    {[
                      {
                        id: 1,
                        k: 'A+',
                      },
                      {
                        id: 2,
                        k: 'A-',
                      },
                      {
                        id: 3,
                        k: 'AB+',
                      },
                      {
                        id: 4,
                        k: 'AB-',
                      },
                      {
                        id: 5,
                        k: 'B+',
                      },
                      {
                        id: 6,
                        k: 'B-',
                      },
                      {
                        id: 7,
                        k: 'O+',
                      },
                      {
                        id: 8,
                        k: 'O-',
                      },
                    ].map((blood_group) => {
                      return (
                        <option key={blood_group.id} value={blood_group.k}>
                          {blood_group.k}
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
              <div className="w-full sm:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Gender
                </label>
                <div className="relative z-20 bg-transparent dark:bg-meta-4">
                  <select
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-meta-4 dark:focus:border-primary"
                    name="gender"
                    id="gender"
                    value={caretaker.gender}
                    onChange={(e) => {
                      handleChange(e);
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
                    ].map((gender) => {
                      return (
                        <option key={gender.id} value={gender.v}>
                          {gender.k}
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
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="created_at_in_utc"
                >
                  Joined
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="created_at_in_utc"
                    id="created_at_in_utc"
                    readOnly
                    value={TimestampConverter(caretaker.created_at_in_utc)}
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="updated_at_in_utc"
                >
                  Last update
                </label>
                <div className="relative">
                  <span className="absolute left-4.5 top-4"></span>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="updated_at_in_utc"
                    id="updated_at_in_utc"
                    readOnly
                    value={TimestampConverter(caretaker?.updated_at_in_utc)}
                  />
                </div>
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
