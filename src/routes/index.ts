import { lazy } from 'react';

// Caretakers
const AllCaretakers = lazy(() => import('../pages/Caretakers/AllCaretakers'));
const AddCaretaker = lazy(() => import('../pages/Caretakers/AddCaretaker'));
const EditCaretaker = lazy(() => import('../pages/Caretakers/EditCaretaker'));

// Doctors
const AllDoctors = lazy(() => import('../pages/Doctors/AllDoctors'));
const AddDoctor = lazy(() => import('../pages/Doctors/AddDoctor'));
const EditDoctor = lazy(() => import('../pages/Doctors/EditDoctor'));

// Patients
const AllPatients = lazy(() => import('../pages/Patients/AllPatients'));
const AddPatient = lazy(() => import('../pages/Patients/AddPatient'));
const EditPatient = lazy(() => import('../pages/Patients/EditPatient'));

// Password
const ChangeStudentPassword = lazy(
  () => import('../pages/Password/ChangePassword'),
);

// Associations
const CaretakerAssociation = lazy(
  () => import('../pages/Associations/CaretakerAssociation'),
);
const DoctorAssociation = lazy(
  () => import('../pages/Associations/DoctorAssociation'),
);

const coreRoutes = [
  {
    path: '/caretakers/all',
    title: 'All Caretakers',
    component: AllCaretakers,
  },
  {
    path: '/caretakers/add',
    title: 'Add Caretakers',
    component: AddCaretaker,
  },
  {
    path: '/caretakers/:id',
    title: 'Edit Caretaker',
    component: EditCaretaker,
  },
  {
    path: '/doctors/all',
    title: 'All Doctors',
    component: AllDoctors,
  },
  {
    path: '/doctors/add',
    title: 'Add Doctors',
    component: AddDoctor,
  },
  {
    path: '/doctors/:id',
    title: 'Edit Doctor',
    component: EditDoctor,
  },
  {
    path: '/patients/all',
    title: 'All Patients',
    component: AllPatients,
  },
  {
    path: '/patients/add',
    title: 'Add Patient',
    component: AddPatient,
  },
  {
    path: '/patients/:id',
    title: 'Edit Patient',
    component: EditPatient,
  },
  {
    path: '/caretakers/associate/:id',
    title: 'Associate Patient to Caretaker',
    component: CaretakerAssociation,
  },
  {
    path: '/doctors/associate/:id',
    title: 'Associate Patient to Doctor',
    component: DoctorAssociation,
  },
  {
    path: '/change/password/:id',
    title: 'Manage User Password',
    component: ChangeStudentPassword,
  },
];

export const routes = [...coreRoutes];
