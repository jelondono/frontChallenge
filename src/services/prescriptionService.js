import axios from "axios";

export const prescriptionService = {
    savePrescription,
    getPrescriptions
};

function savePrescription(body) {
  return axios
    .post(`/prescriptions`, body)
    .then((response) => Promise.resolve(response.data))
    .catch((error) => Promise.reject(error.response));
}

function getPrescriptions(params) {
  return axios
    .get(`/prescriptions?${params}`,{})
    .then((response) => Promise.resolve(response.data))
    .catch((error) => Promise.reject(error.response));
}


