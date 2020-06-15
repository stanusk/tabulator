import { Project } from '@/typings';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import {
    CREATE_PROJECT,
    CLOSE_SELECTED_TABS,
    DOWNLOAD_PROJECTS,
    REMOVE_PROJECT,
    REVIVE_PROJECT,
    ACTIVATE_TAB,
} from '@/store/action-types';
import {
    ADD_PROJECT,
    REMOVE_PROJECT as REMOVE_PROJECT__MUTATION,
    SET_LAST_PROJECT_ID,
    SET_PROJECTS,
    SET_NEW_PROJECT_NAME,
    RESET_NEW_PROJECT_NAME,
} from '@/store/mutation-types';
import { NEW_PROJECT_NAME, PROJECTS } from '@/store/getter-types';
import {
    findTabByUrl,
    makeStorageProjectId,
    packProjectForStorage,
    getWindowsWithSelectedTabs,
    unpackProjectFromStorage,
} from '@/store/helpers/projects';
import { ensure } from '@/store/helpers/helpers';

const state = {
    projects: [] as Project[],
    newProjectName: '',
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
    [CREATE_PROJECT]({ commit, dispatch, rootState, state }) {
        const newProjectId = rootState.extensionProps.lastProjectId + 1;

        const newProject: Project = {
            id: newProjectId,
            name: state.newProjectName,
            windows: getWindowsWithSelectedTabs(
                rootState.windows.selectedTabs,
                rootState.windows.windows
            ),
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
                () => {
                    commit(ADD_PROJECT, newProject);
                    commit(RESET_NEW_PROJECT_NAME);
                    dispatch(CLOSE_SELECTED_TABS);
                    commit(SET_LAST_PROJECT_ID, newProjectId);
                },
                err => {
                    alert('project adding failed: ' + err.message);
                }
            );
    },
    [REVIVE_PROJECT](
        { dispatch, state },
        {
            projectId,
            windowId,
            tabId,
        }: { projectId: number; windowId?: number; tabId?: number }
    ) {
        const project = ensure(
            state.projects.find(p => p.id === projectId),
            `opening project failed: could not find project with id: ${projectId}`
        );

        const windowsCreatePromises = project.windows.map(browserWindow => {
            const windowTabsUrls = browserWindow.tabs.map(tab => tab.url);
            return browser.windows.create({ url: windowTabsUrls });
        });

        if (!tabId) {
            return Promise.all(windowsCreatePromises).then(
                () => {
                    return dispatch(REMOVE_PROJECT, project);
                },
                err => {
                    // todo: rethink errors - alert or console.error, or console.warn, or...
                    alert('opening project failed: ' + err.message);
                    return err;
                }
            );
        } else {
            const targetWindow = ensure(
                project.windows.find(win => win.id === windowId),
                `REVIVE_PROJECT: activating windowId ${windowId} & tabId ${tabId} not possible - window not found in project.`
            );
            const targetTab = ensure(
                targetWindow.tabs.find(tab => tab.id === tabId),
                `REVIVE_PROJECT: activating windowId ${windowId} & tabId ${tabId} not possible - tab not found in project.`
            );

            const targetUrl = targetTab.url;

            return Promise.all(windowsCreatePromises).then(
                windows => {
                    dispatch(REMOVE_PROJECT, project);

                    const {
                        windowId: newWindowId,
                        tabId: newTabId,
                    } = findTabByUrl(windows, targetUrl);

                    if (!newWindowId && !newTabId) {
                        console.warn(
                            `REVIVE_PROJECT: activating tabId ${tabId} not possible - tab not found in revived windows.`
                        );
                    } else {
                        dispatch(ACTIVATE_TAB, {
                            tabId: newTabId,
                            windowId: newWindowId,
                        });
                    }
                },
                err => {
                    // todo: rethink errors - alert or console.error, or console.warn, or...
                    alert('opening project failed: ' + err.message);
                    return err;
                }
            );
        }
    },
    [REMOVE_PROJECT]({ commit }, project: Project) {
        return browser.storage.sync
            .remove(makeStorageProjectId(project.id))
            .then(
                () => {
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
            project => project.id !== projectToRemove.id
        );
    },
    [SET_NEW_PROJECT_NAME](state, newName: string) {
        state.newProjectName = newName;
    },
    [RESET_NEW_PROJECT_NAME](state) {
        state.newProjectName = '';
    },
};

const getters: GetterTree<ProjectsState, RootState> = {
    [PROJECTS](state: ProjectsState) {
        return state.projects;
    },
    [NEW_PROJECT_NAME](state: ProjectsState) {
        return state.newProjectName;
    },
};

export type ProjectsState = typeof state;

export const projects: Module<ProjectsState, RootState> = {
    state,
    actions,
    mutations,
    getters,
};
