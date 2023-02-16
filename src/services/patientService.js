import axios from "axios";

export const patientServices = {
  getListPatients,
};

function getListPatients(params) {
  return axios
    .get(`/patients?${params}`, {})
    .then((response) => Promise.resolve(response.data))
    .catch((error) => Promise.reject(error.response));
}
