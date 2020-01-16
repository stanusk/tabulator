import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TabsList from '@/components/TabsList.vue';

describe('TabsList.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message';
        const wrapper = shallowMount(TabsList, {
            propsData: { msg },
        });
        expect(wrapper.text()).to.include(msg);
    });
});
