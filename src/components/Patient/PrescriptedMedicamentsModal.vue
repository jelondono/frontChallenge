<template>
    <div>
        <b-button size="sm" variant="success" class="mr-2" @click="openModalPrescripted"
            title="Prescribir medicamentos">
            <i class="fa fa-plus"></i>
        </b-button>
        <b-modal ref="modal" hide-footer title="Prescribir medicamento" v-model="isOpenModalPrescripted">
            <b-container>
                <b-form @submit="onSubmit">
                    <b-form-group label="Nombre del paciente:" label-for="name">
                        <b-form-input id="name" v-model="pacient.name" readonly></b-form-input>
                    </b-form-group>
                    <b-form-group label="Medicamento" label-for="medicine-select">
                        <div class="d-flex">
                            <b-form-select id="medicine-select" v-model="selectedMedicine" :options="medicines"
                                value-field="name" text-field="name" />
                            <b-button size="sm" variant="info" class="mr-2" @click="addPrescripted()"
                                v-if="prescriptions.length < 3"> <i class="fa fa-plus" title="Agregar"></i>
                            </b-button>
                            <b-alert variant="danger" v-if="!selectedMedicine && prescriptions.length < 3">
                                Debe seleccionar un medicamento para agregar.
                            </b-alert>
                        </div>

                    </b-form-group>


                </b-form>

                <b-table :items="prescriptions" :fields="medicineTableFields" v-if="prescriptions.length > 0" bordered>
                    <template v-slot:cell(date)="data">
                        {{ data.item.date | dateFormat }}
                    </template>
                    <template v-slot:cell(actions)="data">
                        <b-button size="md" variant="danger" class="mr-4 action-button"
                            @click="deleteMedicine(data.item)" title="Eliminar">
                            <i class="fa fa-trash"></i>
                        </b-button>
                    </template>


                </b-table>
                <b-button variant="primary" v-if="prescriptions.length > 0" @click="onSubmit()">Prescribir</b-button>

            </b-container>
        </b-modal>


    </div>
</template>
<style>
.action-button {
    width: 50px;
}
</style>

<script>
import { medicineServices } from '../../services/medicineService.js';
import { prescriptionService } from '../../services/prescriptionService.js';

export default {
    props: ['pacient'],
    data() {
        return {
            form: {
                patient: '',
                medicine: '',
                date: ''
            },
            isOpenModalPrescripted: false,
            selectedMedicine: '',
            medicines: [],
            prescriptions: [],
            medicineTableFields: [
                { key: 'medicine.name', label: 'Nombre del medicamento' },
                { key: 'date', label: 'Fecha de prescripción' },
                { key: 'actions', label: 'Acciones' }
            ]
        };
    },
    methods: {
        openModalPrescripted() {
            this.isOpenModalPrescripted = true
            this.fetchMedicines();
        },
        onSubmit() {
            const medicineIds = this.prescriptions.map(prescription => prescription.medicine.id);

            const prescription = {
                prescriptionDate: new Date().toJSON(),
                medicineIds: medicineIds,
                patientId: this.pacient.id
            };
            prescriptionService.savePrescription(prescription).then((response) => {
                if (response) {
                    this.isOpenModalPrescripted = false
                    this.$bvToast.toast('Cambios guardados exitosamente', {
                        title: 'Exito',
                        variant: 'info',
                        duration: 300,
                        solid: true
                    })
                }
            }).catch(error => {
                this.$bvToast.toast(error.data.message, {
                    title: 'Error',
                    variant: 'danger',
                    duration: 300,
                    solid: true
                });
            });


        },
        fetchMedicines() {
            // Obtener medicamentos desde el backend
            medicineServices.getListMedicinesByPatient(this.pacient.id).then((response) => {
                if (response.result) {
                    this.medicines = response.result;
                }
            });

        },
        addPrescripted() {
            const date = new Date();
            if (!this.prescriptions.find(x => x.medicine.name === this.selectedMedicine)) {
                let selectedMedicineObject = this.medicines.find(medicine => medicine.name === this.selectedMedicine);
                this.prescriptions.push({
                    date: date.toJSON(),
                    medicine: {
                        id: selectedMedicineObject.id,
                        name: selectedMedicineObject.name
                    },
                });
                this.selectedMedicine = '';
            } else {
                this.$bvToast.toast('No se puede insertar el mismo medicamento', {
                    title: 'Error',
                    variant: 'danger',
                    duration: 300,
                    solid: true,
                });
            }
        }

        ,
        deleteMedicine(item) {
            const index = this.prescriptions.indexOf(item);
            if (index > -1) {
                this.prescriptions.splice(index, 1);
            }
        }
    }

};
</script>
