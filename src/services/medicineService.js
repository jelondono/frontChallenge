import axios from "axios";

export const medicineServices = {
    getListMedicinesByPatient,
};

function getListMedicinesByPatient(idPatient) {
  return axios
    .get(`/medicines/` + idPatient, {})
    .then((response) => Promise.resolve(response.data))
    .catch((error) => Promise.reject(error.response));
}
