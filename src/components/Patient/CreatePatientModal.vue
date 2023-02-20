<template>
    <div>
        <b-button variant="primary" class="float-right" @click="openModalCreatedPatient">Crear nuevo
            paciente</b-button>
        <b-modal ref="modal" hide-footer title="Crear nuevo paciente" v-model="isOpenModalCreated">
            <b-form @submit="createPatient">
                <b-form-group label="Nombre:" label-for="name">
                    <b-form-input id="name" class="form-control" v-model="newPatient.name" required></b-form-input>
                </b-form-group>
                <b-form-group label="Apellido:" label-for="lastname">
                    <b-form-input id="lastname" class="form-control" v-model="newPatient.lastname"
                        required></b-form-input>
                </b-form-group>
                <b-form-group label="Cumpleaños:" label-for="birthdate">
                    <b-form-input id="birthdate" class="form-control" type="date" v-model="newPatient.birthdate"
                        required></b-form-input>
                </b-form-group>
                <b-form-group label="Genero:" label-for="gender">
                    <b-form-select id="gender" required class="form-control" v-model="newPatient.gender.id"
                        :options="genders"></b-form-select>
                </b-form-group>
                <b-button type="submit" variant="primary">Crear paciente</b-button>
                <b-button @click="closeModalCreatedPatient" variant="secondary">Cancelar</b-button>
            </b-form>

        </b-modal>

    </div>

</template>


<script>
import axios from 'axios'

export default {
    data() {
        return {
            newPatient: {
                name: '',
                lastname: '',
                birthdate: '',
                gender: {}
            },
            isOpenModalCreated: false,
            genders: [
                { value: 1, text: 'Masculino' },
                { value: 2, text: 'Femenino' }
            ]
        }
    },
    methods: {
        createPatient() {
            axios
                .post(`/patients/`, this.newPatient)
                .then(response => {
                    // update the pacient in the table
                    let index = this.patients.findIndex(p => p.id === pacient.id)
                    this.$set(this.patients, index, response.data)
                    this.$bvToast.toast('Cambios guardados exitosamente', {
                        title: 'Exito',
                        variant: 'info',
                        duration: 300,
                        solid: true
                    })
                })
                .catch(error => console.log(error))
            this.closeModalCreatedPatient()
        },
        openModalCreatedPatient() {
            this.isOpenModalCreated = true
        },
        closeModalCreatedPatient() {
            this.newPatient = {
                name: '',
                lastname: '',
                birthdate: '',
                gender: {}
            }
            this.isOpenModalCreated = false
        }
    }
}
</script>
