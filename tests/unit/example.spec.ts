import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Project from '@/components/Project.vue';

describe('Project.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message';
        const wrapper = shallowMount(Project, {
            propsData: { msg },
        });
        expect(wrapper.text()).to.include(msg);
    });
});
