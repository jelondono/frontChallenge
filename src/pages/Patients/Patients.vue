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

                            <div class="filter-section">
                                <b-form-checkbox v-model="showFilters" switch size="lg">Filtros</b-form-checkbox>
                                <div v-show="showFilters">
                                    <div class="row">
                                        <div class="col-4">
                                            <input type="text" placeholder="Nombre" v-model="searchNombre" />
                                        </div>
                                        <div class="col-4">
                                            <select v-model="selectedGenero">
                                                <option value="">Todos los géneros</option>
                                                <option v-for="genero in generos" :key="genero.id" :value="genero.id">{{
                                                    genero.name }}</option>
                                            </select>
                                        </div>
                                        <div class="col-2">
                                            <button @click="fetchPatients">Consultar</button>
                                        </div>
                                        <div class="col-2">
                                            <button @click="cleanFilter">Limpiar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <b-table :items="patients" :fields="fields" :current-page="currentPage" striped responsive>
                                    <template v-slot:cell(birthdate)="data">
                                        {{ data.item.birthdate | dateFormat }}
                                    </template>
                                    <template v-slot:cell(gender.name)="data">
                                        {{ data.item.gender.name }}
                                    </template>
                                    <template v-slot:cell(actions)="data">
                                        <edit-patient-modal :pacient="data.item"
                                            @pacient-updated="updatePacientList"></edit-patient-modal>
                                        <b-button size="sm" variant="danger" class="mr-2" @click="deletePacient(data.item)"
                                            title="Eliminar">
                                            <i class="fa fa-trash"></i>
                                        </b-button>
                                        <prescripted-medicaments-modal :pacient="data.item"></prescripted-medicaments-modal>
                                        <prescripted-view-modal :pacient="data.item"></prescripted-view-modal>
                                    </template>
                                </b-table>
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="mt-4"
                                    @change="currentPage = $event">
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
        return {
            currentPage: 1,
            perPage: 10,
            fields: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Nombre' },
                { key: 'lastname', label: 'Apellido' },
                { key: 'birthdate', label: 'Cumpleaños' },
                { key: 'gender.name', label: 'Género' },
                { key: 'actions', label: 'Acciones' }
            ],
            totalRows: 0,
            patients: [],
            newPatient: {},
            isLoading: false,
            showFilters: false,
            searchNombre: '',
            selectedGenero: null,
            generos: []
        }
    },

    watch: {
        currentPage: function () {
            this.fetchPatients();
        },
        showFilters: function () {
            this.searchNombre = '';
            this.selectedGenero = null;
            this.fetchPatients();
        },
        selectedGenero: function () {
            this.fetchPatients();
        }
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
                okTitle: 'Sí',
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
        fetchGeneros() {
            axios.get('/genders')
                .then(response => {
                    this.generos = response.data.result;
                })
        },
        toggleFilters() {
            this.showFilters = !this.showFilters;
        },
        cleanFilter() {
            this.searchNombre = '';
            this.selectedGenero = null;
            this.fetchPatients();
        },
        fetchPatients() {
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;

            let params = {
                page: this.currentPage - 1,
                size: this.perPage
            };

            if (this.showFilters && this.selectedGenero) {
                params.generoId = this.selectedGenero;
            }

            if (this.searchNombre) {
                params.nombre = this.searchNombre;
            }

            patientServices.getListPatients(params)
                .then(response => {
                    if (response.result) {
                        this.patients = response.result.content;
                        this.totalRows = response.result.totalElements;
                    }
                    this.isLoading = false;
                })
                .catch(() => {
                    this.patients = []
                    this.isLoading = false;
                });
        },
        search() {
            this.currentPage = 1;
            this.fetchPatients();
        },
        reset() {
            this.searchNombre = '';
            this.selectedGenero = null;
            this.currentPage = 1;
            this.fetchPatients();
        }
    },
    mounted() {
        this.fetchGeneros();
        this.fetchPatients();
    },
}
</script>

<style scoped>
.filter-section {
    margin-bottom: 20px;
}

.filter-section input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
}

.filter-section select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
}

.filter-section button {
    background-color: #3472F7;
    color: white;
    padding: 14px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
}

</style>