import { shallowMount } from '@vue/test-utils'
import Patients from '@/pages/Patients/Patients.vue'
import CreatePatientModal from '@/components/Patient/CreatePatientModal.vue'
import EditPatientModal from '@/components/Patient/EditPatientModal.vue'
import PrescriptedMedicamentsModal from '@/components/Patient/PrescriptedMedicamentsModal.vue'
import PrescriptedViewModal from '@/components/Patient/PrescriptedViewModal.vue'

describe('Patients.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Patients, {
      mocks: {
        $bvModal: {
          msgBoxConfirm: jest.fn(() => Promise.resolve())
        }
      },
      stubs: {
        'create-patient-modal': CreatePatientModal,
        'edit-patient-modal': EditPatientModal,
        'prescripted-medicaments-modal': PrescriptedMedicamentsModal,
        'prescripted-view-modal': PrescriptedViewModal,
        'b-table': true,
        'b-pagination': true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('fetches patients on mounted', () => {
    const fetchPatientsMock = jest.spyOn(wrapper.vm, 'fetchPatients')
    wrapper.vm.$options.mounted[0].call(wrapper.vm)
    expect(fetchPatientsMock).toHaveBeenCalled()
  })

  it('calls deletePatient when delete button is clicked', () => {
    const deletePatientMock = jest.spyOn(wrapper.vm, 'deletePatient')
    const patient = { id: 1 }
    wrapper.find('.fa-trash').trigger('click')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$bvModal.msgBoxConfirm).toHaveBeenCalled()
      wrapper.vm.$bvModal.msgBoxConfirm.mock.calls[0][1].okHandler()
      expect(deletePatientMock).toHaveBeenCalledWith(patient)
    })
  })

  it('updates patient list after editing a patient', () => {
    const updatedPatient = { id: 1, name: 'Test', lastname: 'Patient', birthdate: '2000-01-01' }
    wrapper.vm.updatePatients(updatedPatient)
    expect(wrapper.vm.patients[0]).toEqual(updatedPatient)
  })
})
