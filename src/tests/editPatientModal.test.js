import { shallowMount } from '@vue/test-utils'
import EditPatientModal from '@/components/Patient/EditPatientModal.vue'

describe('EditPatientModal.vue', () => {
  it('updates patient information', async () => {
    const patient = { id: 1, name: 'Juanes', lastname: 'Londono', birthdate: '1990-01-01', gender: { id: 1 } }
    const wrapper = shallowMount(EditPatientModal, {
      propsData: { pacient: patient }
    })

    // Simulate user input
    wrapper.find('#name').setValue('Jane')
    wrapper.find('#lastname').setValue('Londono')
    wrapper.find('#birthdate').setValue('1995-05-05')
    wrapper.find('#gender').setValue(2)

    // Simulate form submit
    await wrapper.find('form').trigger('submit.prevent')

    // Check that patient information was updated
    expect(wrapper.emitted('pacient-updated')).toBeTruthy()
    expect(wrapper.emitted('pacient-updated')[0][0].name).toBe('Jane')
    expect(wrapper.emitted('pacient-updated')[0][0].lastname).toBe('Londono')
    expect(wrapper.emitted('pacient-updated')[0][0].birthdate).toBe('1995-05-05T00:00:00.000Z')
    expect(wrapper.emitted('pacient-updated')[0][0].gender.id).toBe(2)
  })
})
