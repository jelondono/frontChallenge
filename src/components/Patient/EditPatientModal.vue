<template>
    <div>
        <b-button size="sm" variant="warning" class="mr-2" @click="openModal" title="Editar medicamentos">
            <i class="fa fa-edit"></i>
        </b-button>
        <b-modal ref="modal" title="Editar paciente" no-close-on-backdrop hide-footer v-model="isOpenModalEdit">
            <b-form @submit="updateChanges">
                <b-form-group label="Nombre:" label-for="name">
                    <b-form-input id="name" v-model="pacient.name" required></b-form-input>
                </b-form-group>
                <b-form-group label="Apellido:" label-for="lastname">
                    <b-form-input id="lastname" v-model="pacient.lastname" required></b-form-input>
                </b-form-group>
                <b-form-group label="Cumpleaños:" label-for="birthdate">
                    <b-form-input id="birthdate" type="date" v-model="formattedBirthdate" required></b-form-input>
                </b-form-group>
                <b-form-group label="Genero:" label-for="gender">
                    <b-form-select id="gender" v-model="pacient.gender.id" :options="genders"></b-form-select>
                </b-form-group>
                <b-button type="submit" variant="primary">Guardar</b-button>

            </b-form>
        </b-modal>
    </div>



</template>
<script>

import axios from 'axios'

export default {
    props: ['pacient'],
    computed: {

        formattedBirthdate: {
            get() {
                return this.pacient.birthdate ? new Date(this.pacient.birthdate).toISOString().substr(0, 10) : '';
            },
            set(value) {
                this.pacient.birthdate = new Date(value).toISOString();
            }
        }

    },

    data() {
        return {
            modalTitle: 'Editar Paciente',
            genders: [
                { value: 1, text: 'Masculino' },
                { value: 2, text: 'Femenino' }
            ],
            isOpenModalEdit: false
        }
    },
    methods: {
        updateChanges() {
            console.log(this.pacient)
            axios
                .put(`/patients/${this.pacient.id}`, this.pacient)
                .then(response => {
                    this.isOpenModalEdit = false
                    this.$emit('pacient-updated', this.pacient)
                    this.$bvToast.toast('Cambios guardados exitosamente', {
                        title: 'Exito',
                        variant: 'info',
                        duration: 300,
                        solid: true
                    })
                })
                .catch(error => console.log(error))
        },
        resetModal() {
            this.pacient = {}
        },
        openModal() {
            debugger
            console.log(this.pacient)
            this.isOpenModalEdit = true
        }
    }
}
</script>