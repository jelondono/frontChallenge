<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <b-card-header>
                            Lista de pacientes
                            <div class="container">
                                <create-patient-modal></create-patient-modal>
                            </div>
                        </b-card-header>
                        <b-card-body>
                            <div class="table-responsive">
                                <b-table :items="patients" :fields="fields" :current-page="currentPage" striped
                                    responsive>
                                    <template v-slot:cell(birthdate)="data">
                                        {{ data.item.birthdate | dateFormat }}
                                    </template>
                                    <template v-slot:cell(actions)="data">
                                        <edit-patient-modal :pacient="data.item"
                                            @pacient-updated="updatePacientList"></edit-patient-modal>
                                        <b-button size="sm" variant="danger" class="mr-2"
                                            @click="deletePacient(data.item)" title="Eliminar">
                                            <i class="fa fa-trash"></i>
                                        </b-button>
                                        <prescripted-medicaments-modal
                                            :pacient="data.item"></prescripted-medicaments-modal>
                                        <prescripted-view-modal :pacient="data.item"></prescripted-view-modal>
                                    </template>
                                </b-table>
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                    class="mt-4" @change="currentPage = $event">
                                    <template #first-text><span class="text-success">Primera</span></template>
                                    <template #prev-text><span class="text-danger">Anterior</span></template>
                                    <template #next-text><span class="text-warning">Siguiente</span></template>
                                    <template #last-text><span class="text-info">Ultima</span></template>
                                    <template #ellipsis-text>
                                        <b-spinner small type="grow"></b-spinner>
                                        <b-spinner small type="grow"></b-spinner>
                                        <b-spinner small type="grow"></b-spinner>
                                    </template>
                                    <template #page="{ page, active }">
                                        <b v-if="active">{{ page }}</b>
                                        <i v-else>{{ page }}</i>
                                    </template>
                                </b-pagination>
                            </div>
                        </b-card-body>

                    </div>
                </div>
            </div>
            <div>
            </div>
        </div>
    </div>

</template>
<script>
import axios from 'axios'
import EditPatientModal from '@/components/Patient/EditPatientModal.vue'
import CreatePatientModal from '@/components/Patient/CreatePatientModal.vue'
import PrescriptedMedicamentsModal from '@/components/Patient/PrescriptedMedicamentsModal.vue'
import PrescriptedViewModal from '@/components/Patient/PrescriptedViewModal.vue'
import '../../pipes/formatDate.js'
import VueToast from 'vue-toast-notification';
import { patientServices } from '../../services/patientService.js';

export default {

    components: {
        EditPatientModal,
        CreatePatientModal,
        PrescriptedMedicamentsModal,
        PrescriptedViewModal,
        VueToast
    },


    data() {
        console.log(this.pacient)
        return {
            currentPage: 1,
            perPage: 10,
            fields: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Nombre' },
                { key: 'lastname', label: 'Apellido' },
                { key: 'birthdate', label: 'Cumpleaños' },
                { key: 'gender.name', label: 'genero' },
                { key: 'actions', label: 'Acciones' }
            ],
            totalRows: 0,
            patients: [],
            newPatient: {},
            isLoading: false
        }
    },
    watch: {
        currentPage: function () {
            this.params = `page=${this.currentPage - 1}&size=${this.perPage}`;
            this.fetchPatients();
        },
    },
    computed: {
        params: function () {
            return `page=${this.currentPage - 1}&size=${this.perPage}`;
        },
    },
    methods: {
        updatePacientList(patient) {
            this.patients = this.patients.map(p => {
                if (p.id === patient.id) {
                    return patient
                }
                return p
            })
        },
        deletePacient(pacient) {

            this.$bvModal.msgBoxConfirm('¿Está seguro de que quiere eliminar el registro?', {
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'Si',
                cancelTitle: 'Cancelar',
                hideHeaderClose: false,
            }).then(confirm => {
                if (confirm) {
                    axios
                        .delete(`/patients/${pacient.id}`)
                        .then(response => {
                            // remove the patient from the table
                            let index = this.patients.findIndex(p => p.id === pacient.id)
                            this.patients.splice(index, 1)
                        })
                        .catch(() => {
                            // Show error toast
                            this.$bvToast.toast('Se ha producido un error al eliminar el registro.', {
                                title: 'Error',
                                variant: 'danger'
                            })
                        })
                }
            })

        },
        fetchPatients() {
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
            patientServices.getListPatients(this.params).then((response) => {
                if (response.result) {
                    this.patients = response.result.content;
                    this.totalRows = response.result.totalElements;
                }
                this.isLoading = false;
            }).catch(() => {
                this.isLoading = false;
            });

        }
    },
    mounted() {
        this.fetchPatients();
    },
}
</script>