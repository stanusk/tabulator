import Vue from 'vue';
import Vuex from 'vuex';
import { projects, ProjectsState } from '@/store/projects';
import { windows, WindowsState } from '@/store/windows';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        projects,
        windows,
    },
});

export interface RootState {
    projects: ProjectsState;
    windows: WindowsState;
}
