import { State } from "./state";
import { Patient, Action, ExtendedPatient } from "../types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_EXTENDEDPATIENT":
      return {
        ...state,
        extendedPatients: {
          ...state.extendedPatients,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};

export const setPatientList = (payload: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: payload
  };
};

export const addPatient = (payload: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: payload
  };
};

export const addExtendedPatient = (payload: ExtendedPatient): Action => {
  return {
    type: "ADD_EXTENDEDPATIENT",
    payload: payload
  };
};
