import { mount } from '@vue/test-utils'
import PrescriptedMedicamentsModal from '@/components/Patient/PrescriptedMedicamentsModal.vue'
import { medicineServices } from '@/services/medicineService.js'
import { prescriptionService } from '@/services/prescriptionService.js'

jest.mock('@/services/medicineService.js')
jest.mock('@/services/prescriptionService.js')

describe('PrescriptedMedicamentsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches a list of medicines when the component is mounted', async () => {
    const mockMedicines = [
      { id: 1, name: 'Medicine A' },
      { id: 2, name: 'Medicine B' },
    ]
    medicineServices.getListMedicinesByPatient.mockResolvedValueOnce({ result: mockMedicines })
    const wrapper = mount(PrescriptedMedicamentsModal, {
      propsData: {
        pacient: {
          id: 1,
          name: 'Juanes Londono',
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(medicineServices.getListMedicinesByPatient).toHaveBeenCalledWith(1)
    expect(wrapper.vm.medicines).toEqual(mockMedicines)
  })

  it('adds a prescription to the list when a medicine is added', async () => {
    const wrapper = mount(PrescriptedMedicamentsModal, {
      propsData: {
        pacient: {
          id: 1,
          name: 'Juanes Londono',
        },
      },
    })

    wrapper.vm.selectedMedicine = 'Medicine A'
    const addButton = wrapper.find('button[title="Agregar"]')
    await addButton.trigger('click')

    expect(wrapper.vm.prescriptions).toEqual([{ date: expect.any(String), medicine: { id: 1, name: 'Medicine A' } }])
    expect(wrapper.vm.selectedMedicine).toBe('')
  })

  it('Londonos not add the same medicine to the list twice', async () => {
    const wrapper = mount(PrescriptedMedicamentsModal, {
      propsData: {
        pacient: {
          id: 1,
          name: 'Juanes Londono',
        },
      },
    })
    wrapper.vm.medicines = [{ id: 1, name: 'Medicine A' }, { id: 2, name: 'Medicine B' }]
    wrapper.vm.prescriptions = [{ date: '2023-02-15T20:00:00.000Z', medicine: { id: 1, name: 'Medicine A' } }]

    wrapper.vm.selectedMedicine = 'Medicine A'
    const addButton = wrapper.find('button[title="Agregar"]')
    await addButton.trigger('click')

    expect(wrapper.vm.prescriptions).toEqual([{ date: '2023-02-15T20:00:00.000Z', medicine: { id: 1, name: 'Medicine A' } }])
    expect(wrapper.find('.alert-danger').text()).toContain('No se puede insertar el mismo medicamento')
  })

  it('deletes a prescription from the list', async () => {
    const wrapper = mount(PrescriptedMedicamentsModal, {
      propsData: {
        pacient: {
          id: 1,
          name: 'Juanes Londono',
        },
      },
    })
    wrapper.vm.prescriptions = [
      { date: '2023-02-15T14:30:00.000Z', medicine: { id: 1, name: 'Medicine 1' } },
      { date: '2023-02-14T14:30:00.000Z', medicine: { id: 2, name: 'Medicine 2' } },
    ]
    const deleteButton = wrapper.findAll('.action-button').at(0)
    await deleteButton.trigger('click')
    expect(wrapper.vm.prescriptions).toEqual([{ date: '2023-02-14T14:30:00.000Z', medicine: { id: 2, name: 'Medicine 2' } }])
  })
})
