import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import {
    UPDATE_SEARCH_RESULTS,
    SET_QUICK_ACTION_INPUT,
} from '@/store/action-types';
import {
    RESET_SEARCH_RESULTS,
    SET_QUICK_ACTION_INPUT as SET_INPUT__MUTATION,
    UPDATE_SEARCH_RESULTS as UPDATE_SEARCH_RESULTS__MUTATION,
} from '@/store/mutation-types';
import { QUICK_ACTION_INPUT } from '@/store/getter-types';
import {
    QuickActionSearchResults,
    SearchedOpenTab,
    SearchedProjectTab,
} from '@/typings';

const state = {
    input: '' as string,
    searchResults: {
        projects: [],
        projectTabs: [],
        openTabs: [],
    } as QuickActionSearchResults,
};

const actions: ActionTree<QuickActionsState, RootState> = {
    [SET_QUICK_ACTION_INPUT]({ commit, dispatch }, input: string) {
        commit(SET_INPUT__MUTATION, input);
        dispatch(UPDATE_SEARCH_RESULTS);
    },
    [UPDATE_SEARCH_RESULTS]({ rootState, state, commit }) {
        // todo: refactor/simplify/break down - just don't keep it this way

        commit(RESET_SEARCH_RESULTS);

        const searchPhrase = state.input.toLowerCase();

        if (searchPhrase !== '') {
            // search projects by name
            const projects = [] as number[];
            // search projects by tabs
            const projectTabs = [] as SearchedProjectTab[];

            rootState.projects.projects.forEach(project => {
                // add projects by matching project name
                if (project.name.indexOf(searchPhrase) > -1) {
                    projects.push(project.id);
                }

                // add tabs by matching title/url
                project.tabs.forEach(tab => {
                    if (
                        `${tab.title}${tab.url}`
                            .toLowerCase()
                            .indexOf(searchPhrase) > -1
                    ) {
                        projectTabs.push({
                            projectId: project.id,
                            tabId: tab.id,
                        });
                    }
                });
            });

            // search open tabs
            const openTabs = [] as SearchedOpenTab[];

            rootState.windows.windows.forEach(window => {
                window.tabs.forEach(tab => {
                    if (
                        `${tab.title}${tab.url}`
                            .toLowerCase()
                            .indexOf(searchPhrase) > -1
                    ) {
                        openTabs.push({ windowId: window.id, tabId: tab.id });
                    }
                });
            });

            commit(UPDATE_SEARCH_RESULTS__MUTATION, {
                projects,
                projectTabs,
                openTabs,
            });
        }
    },
};

const mutations: MutationTree<QuickActionsState> = {
    [SET_INPUT__MUTATION](state: QuickActionsState, input: string) {
        state.input = input;
    },
    [RESET_SEARCH_RESULTS](state: QuickActionsState) {
        state.searchResults = {
            projects: [],
            projectTabs: [],
            openTabs: [],
        } as QuickActionSearchResults;
    },
    [UPDATE_SEARCH_RESULTS__MUTATION](
        state: QuickActionsState,
        results: QuickActionSearchResults
    ) {
        state.searchResults = results;
    },
};

const getters: GetterTree<QuickActionsState, RootState> = {
    [QUICK_ACTION_INPUT](state: QuickActionsState) {
        return state.input;
    },
};

export type QuickActionsState = typeof state;

export const quickActions: Module<QuickActionsState, RootState> = {
    state,
    actions,
    mutations,
    getters,
};
