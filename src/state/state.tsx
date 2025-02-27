import React, { createContext, useContext, useReducer } from "react";
import { ExtendedPatient, Patient, Action, Diagnosis } from "../types";

export type State = {
  patients: { [id: string]: Patient };
  extendedPatients: { [id: string]: ExtendedPatient };
  diagnoses: { [code: string]: Diagnosis };
};

const initialState: State = {
  patients: {},
  extendedPatients: {},
  diagnoses: {},
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
