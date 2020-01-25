import { Project } from '@/typings';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import {
    CREATE_PROJECT,
    CLOSE_SELECTED_TABS,
    DOWNLOAD_PROJECTS,
    REMOVE_PROJECT,
    REVIVE_PROJECT,
} from '@/store/action-types';
import {
    ADD_PROJECT,
    REMOVE_PROJECT as REMOVE_PROJECT__MUTATION,
    SET_LAST_PROJECT_ID,
    SET_PROJECTS,
} from '@/store/mutation-types';
import { PROJECTS } from '@/store/getter-types';
import {
    packProjectForStorage,
    unpackProjectFromStorage,
} from '@/store/helpers/helpers';

const state = {
    projects: [] as Project[],
};

const actions: ActionTree<ProjectsState, RootState> = {
    [DOWNLOAD_PROJECTS]({ commit }) {
        return browser.storage.sync.get().then(result => {
            commit(SET_PROJECTS, unpackProjectFromStorage(result));
            if (result?.extensionProps?.lastProjectId) {
                commit(
                    SET_LAST_PROJECT_ID,
                    result.extensionProps.lastProjectId
                );
            }
        });
    },
    [CREATE_PROJECT]({ commit, dispatch, rootState }, projectName: string) {
        const newProjectId = rootState.extensionProps.lastProjectId + 1;

        const newProject = {
            id: 'proj_' + newProjectId,
            name: projectName,
            tabs: rootState.windows.selectedTabs,
        };

        return browser.storage.sync
            .set({
                ...packProjectForStorage(newProject),
                extensionProps: {
                    ...rootState.extensionProps,
                    lastProjectId: newProjectId,
                },
            })
            .then(
                _ => {
                    commit(ADD_PROJECT, newProject);
                    dispatch(CLOSE_SELECTED_TABS);
                    commit(SET_LAST_PROJECT_ID, newProjectId);
                },
                err => {
                    alert('project adding failed: ' + err.message);
                }
            );
    },
    [REVIVE_PROJECT]({ dispatch }, project: Project) {
        const urlsByWindowIdDict = project.tabs.reduce((urlsDict, tab) => {
            if (!urlsDict.hasOwnProperty(tab.windowId)) {
                urlsDict[tab.windowId] = [tab.url];
            } else {
                urlsDict[tab.windowId] = [...urlsDict[tab.windowId], tab.url];
            }

            return urlsDict;
        }, {} as { [windowId: number]: string[] });

        const windowsCreatePromises = Object.values(urlsByWindowIdDict).map(
            urls => {
                return browser.windows.create({ url: urls });
            }
        );

        Promise.all(windowsCreatePromises).then(
            _ => {
                dispatch(REMOVE_PROJECT, project);
            },
            err => {
                alert('opening tabs failed: ' + err.message);
            }
        );
    },
    [REMOVE_PROJECT]({ commit }, project: Project) {
        return browser.storage.sync.remove(project.id).then(
            _ => {
                commit(REMOVE_PROJECT__MUTATION, project);
            },
            err => {
                alert('project removal failed: ' + err.message);
            }
        );
    },
};

const mutations: MutationTree<ProjectsState> = {
    [SET_PROJECTS](state: ProjectsState, projects: Project[]) {
        state.projects = projects;
    },
    [ADD_PROJECT](state: ProjectsState, project: Project) {
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
