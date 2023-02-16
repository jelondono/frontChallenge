import { shallowMount } from '@vue/test-utils';
import Patients from '@/pages/Patients/Patients.vue';
import CreatePatientModal from '@/components/Patient/CreatePatientModal.vue';

describe('Patients.vue', () => {
  it('should contain a CreatePatientModal component', () => {
    const wrapper = shallowMount(Patients);
    expect(wrapper.contains(CreatePatientModal)).toBe(true);
  });

  it('should create a new patient when createPatient method is called', () => {
    const mockPatient = {
      name: 'Juanes',
      lastname: 'Londono',
      birthdate: '1990-01-01',
      gender: { id: 1 },
    };
    const postSpy = jest.spyOn(Patients.methods, 'createPatient');
    const axiosPostSpy = jest.spyOn(Patients.methods, 'axiosPost');
    axiosPostSpy.mockImplementation(() => Promise.resolve({ data: mockPatient }));
    const wrapper = shallowMount(Patients);
    const button = wrapper.find('b-button');
    button.trigger('click');
    const modal = wrapper.find('b-modal-stub');
    modal.vm.$emit('submit');
    expect(postSpy).toHaveBeenCalled();
    expect(wrapper.vm.newPatient.name).toBe('');
    expect(wrapper.vm.newPatient.lastname).toBe('');
    expect(wrapper.vm.newPatient.birthdate).toBe('');
    expect(wrapper.vm.newPatient.gender).toEqual({});
  });

  it('should close the modal and clear the form when closeModalCreatedPatient method is called', () => {
    const wrapper = shallowMount(Patients);
    const button = wrapper.find('b-button');
    button.trigger('click');
    expect(wrapper.vm.isOpenModalCreated).toBe(true);
    const modal = wrapper.find('b-modal-stub');
    modal.vm.$emit('hidden');
    expect(wrapper.vm.isOpenModalCreated).toBe(false);
    expect(wrapper.vm.newPatient.name).toBe('');
    expect(wrapper.vm.newPatient.lastname).toBe('');
    expect(wrapper.vm.newPatient.birthdate).toBe('');
    expect(wrapper.vm.newPatient.gender).toEqual({});
  });
});
