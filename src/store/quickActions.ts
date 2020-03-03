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
import {
    AGGREGATED_SEARCH_RESULTS,
    QUICK_ACTION_INPUT,
} from '@/store/getter-types';
import {
    AggregatedSearchResults,
    QuickActionSearchResults,
    SearchedOpenTab,
    SearchedProject,
    SearchedProjectTab,
    SearchedWindow,
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
    [AGGREGATED_SEARCH_RESULTS](
        state: QuickActionsState,
        getters: any,
        rootState: RootState
    ) {
        // aggregate projects
        // todo: refactor/simplify/break down & move to service - just don't keep it this way
        const projects = rootState.projects.projects.reduce(
            (result, currentProject) => {
                const searchedProjectsIncludeCurrentProject = state.searchResults.projects.includes(
                    currentProject.id
                );
                const currentProjectTabsIncludedInSearchedProjectTabs = currentProject.tabs.filter(
                    tab => {
                        return !!state.searchResults.projectTabs.find(
                            searchResultTab =>
                                searchResultTab.projectId ===
                                    currentProject.id &&
                                searchResultTab.tabId === tab.id
                        );
                    }
                );

                if (
                    searchedProjectsIncludeCurrentProject ||
                    currentProjectTabsIncludedInSearchedProjectTabs.length > 0
                ) {
                    const tabs = currentProjectTabsIncludedInSearchedProjectTabs;
                    return [
                        ...result,
                        {
                            ...currentProject,
                            tabs,
                            hiddenTabsCount:
                                currentProject.tabs.length - tabs.length,
                        },
                    ];
                } else {
                    return result;
                }
            },
            [] as SearchedProject[]
        );

        // aggregate windows
        // todo: refactor/simplify/break down & move to service - just don't keep it this way
        const allAvailableWindows = rootState.windows.windows;
        const windows = state.searchResults.openTabs.reduce(
            (result, currentTab) => {
                const targetWindow = allAvailableWindows.find(
                    win => win.id === currentTab.windowId
                );

                if (!targetWindow) {
                    console.error(
                        `AGGREGATED_SEARCH_RESULTS failed: window ${currentTab.windowId} not found!`
                    );
                    return result;
                }

                const targetTab = targetWindow.tabs.find(
                    tab => tab.id === currentTab.tabId
                );

                if (!targetTab) {
                    console.error(
                        `AGGREGATED_SEARCH_RESULTS failed: tab ${currentTab.tabId} not found!`
                    );
                    return result;
                }

                const targetWindowIndexInResult = result.findIndex(
                    win => win.id === currentTab.windowId
                );
                const windowIsAlreadyInResult = targetWindowIndexInResult > -1;

                if (windowIsAlreadyInResult) {
                    return result.map((win, index) => {
                        if (index === targetWindowIndexInResult) {
                            return {
                                ...win,
                                tabs: [...win.tabs, targetTab],
                                hiddenTabsCount: win.hiddenTabsCount - 1,
                            };
                        } else {
                            return win;
                        }
                    });
                } else {
                    return [
                        ...result,
                        {
                            ...targetWindow,
                            tabs: [targetTab],
                            hiddenTabsCount: targetWindow.tabs.length - 1,
                        },
                    ];
                }
            },
            [] as SearchedWindow[]
        );

        return { projects, windows } as AggregatedSearchResults;
    },
};

export type QuickActionsState = typeof state;

export const quickActions: Module<QuickActionsState, RootState> = {
    state,
    actions,
    mutations,
    getters,
};
