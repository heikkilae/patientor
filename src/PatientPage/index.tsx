import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { Button, Header, Icon } from "semantic-ui-react";
import EntryDetails from "../components/EntryDetails";
import { apiBaseUrl } from "../constants";
import { addEntryForPatient, addExtendedPatient, setDiagnosistList, useStateValue } from "../state";
import { Diagnosis, ExtendedPatient, HealthCheckEntry, HealthCheckRating } from "../types";
import HealtyCheckModal from "../HealtyCheckModal";
import { HealthCheckEntryFormValues } from "../HealtyCheckModal/AddEntryForm";

const PatientPage = () => {
  const { id } = useParams<{ id: string | undefined }>();

  if (!id) return null;

  const [{ extendedPatients, diagnoses }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    const fetchDiagnosisList = async () => {
      try {
        const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosistList(diagnosisListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchDiagnosisList();

    if (extendedPatients[id]) {
      console.log("ePatient already in state");
      return;
    }
    console.log("fetch new ePatient");
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<ExtendedPatient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(addExtendedPatient(patientFromApi));
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          console.log(error.response.data.message);
        }
      }
    };

    void fetchPatient();

  }, [dispatch]);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: HealthCheckEntryFormValues) => {
    const payload = {
      healthCheckRating: HealthCheckRating[values.healthCheckRating],
      description: values.description,
      date: values.date,
      specialist: values.specialist,
      type: values.type,
      diagnosisCodes: values.diagnosisCodes,
    };

    try {
      const { data: newEntry } = await axios.post<HealthCheckEntry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        payload
      );

      dispatch(addEntryForPatient(id, newEntry));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

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
        {patient.entries.map((entry, i) => <EntryDetails key={i} entry={entry} diagnoses={diagnoses} />
        )}

      <HealtyCheckModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </>
  );
};

export default PatientPage;
