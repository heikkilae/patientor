import React from "react";
import { Diagnosis, Entry } from "../types";
import { Card, Icon } from "semantic-ui-react";

 const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<{ entry: Entry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry , diagnoses }) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <Card>
          <Card.Content>
            <Card.Header key={entry.id}>{entry.date} <Icon name="doctor" /> </Card.Header>
            <Card.Description>{entry.description}</Card.Description>
            <ul>
              {entry.diagnosisCodes?.map(code => {
                return (<li key={code}>{code} {diagnoses[code].name}</li>);
              })}
            </ul>
            {entry.healthCheckRating === 0 && <Icon color="green" name="heart" /> }
            {entry.healthCheckRating === 1 && <Icon color="yellow" name="heart" /> }
            {entry.healthCheckRating === 2 && <Icon color="orange" name="heart" /> }
            {entry.healthCheckRating === 3 && <Icon color="red" name="heart" /> }
          </Card.Content>
        </Card>
      );
    case "OccupationalHealthcare":
      return (
        <Card>
          <Card.Content>
            <Card.Header key={entry.id}>{entry.date} <Icon name="stethoscope" /> {entry.employerName} </Card.Header>
            <Card.Description>{entry.description}</Card.Description>
            <ul>
              {entry.diagnosisCodes?.map(code => {
                return (<li key={code}>{code} {diagnoses[code].name}</li>);
              })}
            </ul>
            <p>
              Sickleave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}
            </p>
          </Card.Content>
        </Card>
      );
    case "Hospital":
      return (
        <Card>
          <Card.Content>
            <Card.Header key={entry.id}>{entry.date} <Icon name="hospital" /> </Card.Header>
            <Card.Description>{entry.description}</Card.Description>
            <ul>
              {entry.diagnosisCodes?.map(code => {
                return (<li key={code}>{code} {diagnoses[code].name}</li>);
              })}
            </ul>
            <p>
              discharge: {entry.discharge.date} <br />
              criteria: {entry.discharge.criteria}
            </p>
          </Card.Content>
        </Card>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
