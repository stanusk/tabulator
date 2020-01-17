import { Project } from '@/typings';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import {
    ADD_PROJECT,
    DOWNLOAD_PROJECTS,
    REMOVE_PROJECT,
    UPLOAD_PROJECTS,
} from '@/store/action-types';
import {
    ADD_PROJECT as ADD_PROJECT_MUTATION,
    REMOVE_PROJECT as REMOVE_PROJECT__MUTATION,
    SET_PROJECTS,
} from '@/store/mutation-types';
import { PROJECTS } from '@/store/getter-types';

const state = {
    projects: [] as Project[],
};

const actions: ActionTree<ProjectsState, RootState> = {
    [DOWNLOAD_PROJECTS]({ commit }) {
        return browser.storage.sync.get('projects').then(result => {
            commit(SET_PROJECTS, JSON.parse(result.projects));
        });
    },
    [UPLOAD_PROJECTS]({ state }) {
        return browser.storage.sync.set({
            projects: JSON.stringify(state.projects),
        });
    },
    [ADD_PROJECT]({ commit, dispatch }, project: Project) {
        commit(ADD_PROJECT_MUTATION, project);
        dispatch(UPLOAD_PROJECTS);
    },
    [REMOVE_PROJECT]({ commit, dispatch }, projects: Project[]) {
        commit(REMOVE_PROJECT__MUTATION, projects);
        dispatch(UPLOAD_PROJECTS);
    },
};

const mutations: MutationTree<ProjectsState> = {
    [SET_PROJECTS](state: ProjectsState, projects: Project[]) {
        state.projects = projects;
    },
    [ADD_PROJECT_MUTATION](state: ProjectsState, project: Project) {
        state.projects = [...state.projects, project];
    },
    [REMOVE_PROJECT__MUTATION](state: ProjectsState, projectToRemove: Project) {
        state.projects = state.projects.filter(
            project => project.name !== projectToRemove.name
        );
    },
};

const getters: GetterTree<ProjectsState, RootState> = {
    [PROJECTS](state: ProjectsState) {
        return state.projects;
    },
};

export type ProjectsState = typeof state;

export const projects: Module<ProjectsState, RootState> = {
    state,
    actions,
    mutations,
    getters,
};
