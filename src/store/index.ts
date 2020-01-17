import Vue from 'vue';
import Vuex from 'vuex';
import { projects, ProjectsState } from '@/store/projects';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        projects,
    },
});

export interface RootState {
    projects: ProjectsState;
}
