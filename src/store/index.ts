import Vue from 'vue';
import Vuex from 'vuex';
import { projects, ProjectsState } from '@/store/projects';
import { windows, WindowsState } from '@/store/windows';
import { extensionProps, ExtensionPropsState } from '@/store/extensionProps';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        projects,
        windows,
        extensionProps,
    },
});

export interface RootState {
    projects: ProjectsState;
    windows: WindowsState;
    extensionProps: ExtensionPropsState;
}
