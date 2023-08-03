<template>
    <div>
        <b-button size="sm" variant="info" class="mr-2" @click="openModalPrescripted" title="Ver prescripciones">
            <i class="nc-icon nc-audio-92"></i>
        </b-button>
        <b-modal ref="modal" hide-footer title="Ver prescripciones" v-model="isOpenModalViewPrescripted">
            <b-alert show variant="primary" class>
                <i class="nc-icon nc-bell-55 mr-2"></i>
                Dar click en las prescripciones para ver los medicamentos asociados
            </b-alert>
            <b-container>
                <b-row>
                    <b-col cols="12" md="6" v-for="prescription in prescriptions" :key="prescription.id">
                        <b-card class="b-card">
                            <transition-group name="flip">
                                <div v-if="showPrescriptionDetails === prescription.id" :key="1">
                                    <b-card-body>
                                        <b-row @click="showPrescriptionDetails = null">
                                            <b-col cols="12">
                                                <p><strong>Medicamentos</strong> </p>
                                                <p v-if="prescription.medicines.length === 0">
                                                    Esta prescripción no tiene medicamentos asociados
                                                </p>
                                                <p v-else-if="prescription.medicines.length <= 2">
                                                    <b-row v-for="medicine in prescription.medicines"
                                                        :key="medicine.id">
                                                        <b-col cols="12">
                                                            <p>- {{ medicine.name }}</p>
                                                        </b-col>
                                                    </b-row>
                                                </p>
                                                <p v-else>
                                                    <b-button size="sm" variant="info"
                                                        @click="openModalMedicines(prescription)">
                                                        Ver todos los medicamentos
                                                    </b-button>
                                                </p>
                                            </b-col>
                                        </b-row>
                                    </b-card-body>
                                </div>
                                <div v-if="showPrescriptionDetails !== prescription.id" :key="3">
                                    <b-card-body @click="showPrescriptionDetails = prescription.id">
                                        <b-row>
                                            <b-col cols="12">
                                                <p><strong>Numero de prescripcion: </strong>{{ prescription.id }}</p>
                                                <p><strong>Fecha de prescripcion: </strong> {{
                                                    prescription.prescriptionDate | dateFormat
                                                }}</p>
                                            </b-col>
                                        </b-row>
                                    </b-card-body>
                                </div>
                            </transition-group>
                        </b-card>

                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
        <b-modal ref="modalMedicines" hide-footer title="Ver medicinas">
            <b-container>
                <b-row>
                    <strong>Medicamentos</strong>
                    <b-col cols="12" v-for="medicine in medicines" :key="medicine.id">
                        <p>- {{ medicine.name }}</p>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>
  

<script>
import { prescriptionService } from '../../services/prescriptionService.js';

export default {
    props: ['pacient'],
    data() {
        return {
            isOpenModalViewPrescripted: false,
            prescriptions: [],
            showPrescriptionDetails: null,
            showAlert: true
        };
    },
    methods: {
        openModalPrescripted() {
            this.fetchPrescriptions();
        },
        fetchPrescriptions() {
            const params = `patientId=${this.pacient.id}`;

            prescriptionService.getPrescriptions(params)
                .then((response) => {
                    if (response.result) {
                        this.isOpenModalViewPrescripted = true;
                        this.prescriptions = response.result;
                    }
                })
                .catch((error) => {
                    this.$bvToast.toast('No existen prescripciones asociadas a este paciente', {
                        title: 'Prescripciones',
                        variant: 'danger',
                        duration: 300,
                        solid: true
                    });
                });

        },
        openModalMedicines(prescription) {
            this.medicines = prescription.medicines;
            this.$refs.modalMedicines.show();
        }
    }
};
</script>

<style>
.b-card:hover {
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>