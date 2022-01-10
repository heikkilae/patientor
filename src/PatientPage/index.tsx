import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { Header, Icon } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { ExtendedPatient } from "../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string | undefined }>();

  if (!id) return null;

  const [{ extendedPatients }, dispatch] = useStateValue();

  React.useEffect(() => {
    if (extendedPatients[id]) {
      console.log("ePatient already in state");
      return;
    }
    console.log("fetch new ePatient");
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<ExtendedPatient>(`${apiBaseUrl}/patients/${id}`);
        dispatch({ type: "ADD_EXTENDEDPATIENT", payload: patientFromApi });
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          console.log(error.response.data.message);
        }
      }
    };

    void fetchPatient();

  }, [dispatch]);

  const patient = extendedPatients[id];

  if (!patient) return null;
  return (
    <>
      <Header as="h2">
        {patient.name}
        {patient.gender === "male" && <Icon name="mars"></Icon>}
        {patient.gender === "female" && <Icon name="venus"></Icon>}
        {patient.gender !== "male" && patient.gender !== "female" && <Icon name="genderless"></Icon>}
      </Header>
      <p>
        ssn: {patient.ssn} <br />
        occupation: {patient.occupation}
      </p>
    </>
  );
};

export default PatientPage;
