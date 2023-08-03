<template>
    <div>
        <!-- Información personal -->
        <!-- Botones para controlar la dictación -->
        <b-button variant="primary" class="my-2" @click="startDictation"> <i class="nc-icon nc-audio-92"></i>
            Dictar
            Atención</b-button>
        <b-button variant="danger" class="my-2 ml-2" @click="stopDictation" v-if="isRecording" id="recordingIndicator">
            <i class="nc-icon nc-button-power"></i>
        </b-button>
        
        <!-- Área de texto para la dictación -->
        <b-form-textarea id="dictation" v-model="dictation" placeholder="Dictado" rows="3" max-rows="6"></b-form-textarea>
        <br><br>
        <b-card header="Información Personal" class="mb-3">
            <b-row>
                <b-col cols="12" md="4">
                    <b-form-group label="Información Acompañante:" label-for="accompanyingInfo">
                        <b-form-input id="accompanyingInfo" size="sm" type="text" class="form-control"
                            v-model="patient.patientcompanionrelationship" required></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group label="Nombre del Paciente:" label-for="patientName">
                        <b-form-input id="patientName" size="sm" type="text" class="form-control"
                            v-model="patient.namePatient" required></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group label="Edad del Paciente:" label-for="patientAge">
                        <b-form-input id="patientAge" size="sm" type="text" class="form-control"
                            v-model="patient.agePatient" required></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" md="4">
                    <b-form-group label="Fecha de Nacimiento:" label-for="patientDOB">
                        <b-form-input id="patientDOB" size="sm" type="date" class="form-control"
                            v-model="patient.dateBirthDate" required></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-card>


        <!-- Signos vitales -->
        <b-card header="Signos Vitales" class="mb-3">
            <b-row>
                <b-col cols="12" md="4">
                    <b-form-group label="Peso:" label-for="weight">
                        <b-form-input id="weight" size="sm" type="text" class="form-control"
                            v-model="patient.vitalSigns.weight" required></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group label="Altura:" label-for="height">
                        <b-form-input id="height" size="sm" type="text" class="form-control"
                            v-model="patient.vitalSigns.height" required></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="4">
                    <b-form-group label="Pulso:" label-for="pulse">
                        <b-form-input id="pulse" size="sm" type="text" class="form-control"
                            v-model="patient.vitalSigns.pulse" required></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-card>


        <!-- Diagnóstico -->
        <b-card header="Diagnóstico" class="mb-3">
            <b-form-group label="Diagnóstico:" label-for="diagnosis">
                <b-form-select text-field="name" value-field="id" id="diagnosis" size="sm" class="form-control"
                    v-model="patient.diagnosticList[0] ? patient.diagnosticList[0].id : patient.diagnosticList[0]"
                    :options="diagnosisOptions"></b-form-select>
            </b-form-group>
        </b-card>

        <!-- Tabla de medicamentos prescritos -->
        <b-card header="Medicamentos Prescritos">
            <b-table :items="patient.medicamentsList" :fields="medicationFields" striped responsive>
                <template v-slot:cell(name)="data">
                    {{ data.item.id }}
                </template>
                <template v-slot:cell(dosage)="data">
                    {{ data.item.nomMedicamento }}
                </template>
                <template v-slot:cell(duration)="data">
                    {{ data.item.duration }}
                </template>
            </b-table>
        </b-card>
        <!-- Enfermedad actual y motivo de consulta -->
        <b-card header="Enfermedad Actual y Motivo de Consulta" class="mb-3">
            <b-form-group label="Enfermedad Actual:" label-for="currentIllness">
                <b-form-textarea id="currentIllness" size="sm" v-model="patient.currentIllness" rows="3"
                    max-rows="6"></b-form-textarea>
            </b-form-group>
            <b-form-group label="Motivo de Consulta:" label-for="reasonForConsultation">
                <b-form-textarea id="reasonForConsultation" size="sm" v-model="patient.reasonForConsultation" rows="3"
                    max-rows="6"></b-form-textarea>
            </b-form-group>
        </b-card>

        <!-- Examen Físico -->
        <b-card header="Examen Físico" class="mb-3">
            <b-form-group label="Resultados del Examen Físico:" label-for="physicalExamination">
                <b-form-textarea id="physicalExamination" size="sm" v-model="patient.physicalExamination" rows="3"
                    max-rows="6"></b-form-textarea>
            </b-form-group>
        </b-card>

        <!-- Impresión y plan de manejo -->
        <b-card header="Impresión y Plan de Manejo" class="mb-3">
            <b-form-group label="Impresión Clínica:" label-for="clinicalImpression">
                <b-form-textarea id="clinicalImpression" size="sm" v-model="patient.clinicalImpression" rows="3"
                    max-rows="6"></b-form-textarea>
            </b-form-group>
            <b-form-group label="Plan de Manejo:" label-for="managementPlan">
                <b-form-textarea id="managementPlan" size="sm" v-model="patient.managementPlan" rows="3"
                    max-rows="6"></b-form-textarea>
            </b-form-group>
        </b-card>



        <b-button type="submit" variant="primary" v-bind:disabled="isLoading">
            <span v-if="isLoading">
                <i class="fa fa-spinner fa-spin"></i> Cargando...
            </span>
            <span v-else>
                Crear Historia Clínica
            </span>
        </b-button>





    </div>
</template>
<style>
.flex-container {
    display: flex;
    align-items: center;
}

.flex-container>* {
    margin-right: 10px;
}

#recordingIndicator {
    animation: blink 1s infinite;
}

@keyframes blink {
    0% {
        opacity: 1.0;
    }

    50% {
        opacity: 0.0;
    }

    100% {
        opacity: 1.0;
    }
}
</style>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            dictation: '',
            recognition: null,
            isRecording: false,
            isLoading: false,
            patient: {
                namePatient: '',
                patientcompanionrelationship: '',
                agePatient: '',
                dateBirthDate: null,
                currentIllness: '',
                reasonForConsultation: '',
                physicalExamination: '',
                clinicalImpression: '',
                managementPlan: '',
                vitalSigns: {
                    weight: '',
                    height: '',
                    pulse: ''
                },
                diagnosticList: [{
                    id: null
                }],
                medicamentsList: [],
            },
            diagnosisOptions: [
                {
                    "id": 1,
                    "name": "Gripa"
                },
                {
                    "id": 2,
                    "name": "Gastritis"
                },
                {
                    "id": 3,
                    "name": "Migraña"
                }
            ],
            prescribedMedications: [],
            medicationFields: [
                { key: 'name', label: 'Medicamento' },
                { key: 'dosage', label: 'Dosis' },
                { key: 'duration', label: 'Duración' }
            ],
            confirmedFields: {
                name: '',
                vitalSigns: {
                    weight: '',
                    // inicializa todas las propiedades que intentas acceder
                    height: '',
                    pulse: ''
                },
                diagnosis: ''
            }, transcriptAnalysis: {
                name: '',
                vitalSigns: {
                    weight: '',
                    // asegúrate de inicializar todas las propiedades que intentas acceder
                    height: '',
                    pulse: ''
                },
                diagnosis: ''
            },
            mediaRecorder: null, // Añadir esta línea
            chunks: [], // Añadir esta línea
        }
    },

    created() {  // Añadido
        // Comprueba si el navegador soporta la API de reconocimiento de voz
        if (!('webkitSpeechRecognition' in window)) {
            alert('Lo siento, tu navegador no soporta la API de reconocimiento de voz.');
        } else {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;  // la grabación no se detendrá automáticamente
            this.recognition.interimResults = false;  // sólo queremos los resultados finales, no los interinos

            this.recognition.onresult = (event) => {
                let transcript = this.dictation;
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;

                    if (event.results[i][0].transcript.trim().toLowerCase() === 'detener' || event.results[i][0].transcript.trim().toLowerCase() === 'detener') {
                        this.stopDictation();
                        return;
                    }
                }
                this.dictation = transcript;
            }

            if ('MediaRecorder' in window) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        this.mediaRecorder = new MediaRecorder(stream);

                        this.mediaRecorder.ondataavailable = e => {
                            this.chunks.push(e.data);
                        };

                        this.mediaRecorder.onstop = e => {
                            const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = 'test.ogg';
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(function () {
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(url);
                            }, 100);
                        };
                    });
            }

        }
    },
    methods: {
        startDictation() {
            if (this.recognition) {
                this.recognition.start();
                this.isRecording = true;
                if (this.mediaRecorder) {
                    this.chunks = []; // Limpiar los chunks antiguos
                    this.mediaRecorder.start();
                }
            }
        },
        stopDictation() {
            if (this.recognition) {
                this.recognition.stop();
                this.isRecording = false;
                // Añade un retraso antes de llamar a analyzeTranscription
                setTimeout(() => {
                    this.analyzeTranscription();
                }, 2000); // Puedes ajustar el tiempo de retraso
                if (this.mediaRecorder) {
                    this.mediaRecorder.stop();
                }
            }
        },
        pauseDictation() {
            if (this.recognition) {
                this.recognition.pause();
            }
        },
        createMedicalHistory() {
            // Aquí va el código para crear la historia clínica
        },
        fetchPrescribedMedications() {
            // Aquí va el código para buscar los medicamentos prescritos para este paciente
        },

        async analyzeTranscription() {
            try {
                
                const response = await axios.post('/api/v1/analyzeMedicalTranscription', { "transcript": this.dictation }, {
                    headers: {
                        Authorization: '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'
                    }
                });
                // Asignar datos a variables
                if (response.data && response.data.encounterCommonInfo) {
                    debugger
                    this.patient = response.data.encounterCommonInfo;
                }
            } catch (error) {
                console.error(error);
            }
        },

        confirmFields() {
            // Combina los campos confirmados con los datos del paciente
            for (let field in this.confirmedFields) {
                if (this.confirmedFields[field]) {
                    this.patient[field] = this.transcriptAnalysis[field];
                }
            }
        }
    },
    mounted() {
        this.fetchPrescribedMedications();
    }
}
</script>
