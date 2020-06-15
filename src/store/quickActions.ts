import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import {
    UPDATE_SEARCH_RESULTS,
    SET_QUICK_ACTION_INPUT,
    SELECT_FIRST_RESULT,
    SELECT_NEXT_RESULT,
    SELECT_PREVIOUS_RESULT,
    EXECUTE_QUICK_ACTION,
    ACTIVATE_TAB,
    REVIVE_PROJECT,
} from '@/store/action-types';
import {
    RESET_SEARCH_RESULTS,
    RESET_SELECTED_RESULT,
    SET_QUICK_ACTION_INPUT as SET_INPUT__MUTATION,
    SET_SELECTED_RESULT,
    SET_SEARCH_RESULTS,
    RESET_QUICK_ACTION_INPUT,
} from '@/store/mutation-types';
import {
    AGGREGATED_SEARCH_RESULTS,
    QUICK_ACTION_INPUT,
    SELECTED_RESULT,
} from '@/store/getter-types';
import {
    AggregatedSearchResults,
    QuickActionSearchResults,
    SearchedOpenTabResult,
    SearchedProjectAggregate,
    SearchedProjectResult,
    SearchedWindowAggregate,
} from '@/typings';
import {
    isSearchedOpenTabResult,
    isSearchedProjectResult,
    isSearchedProjectTab,
} from '@/store/helpers/helpers';
import { findOpenTabs, findProjects } from '@/store/helpers/quickActions';

const state = {
    input: '' as string,
    searchResults: {
        projects: [],
        openTabs: [],
    } as QuickActionSearchResults,
    selectedResult: null as
        | null
        | SearchedProjectResult
        | SearchedOpenTabResult,
};

const actions: ActionTree<QuickActionsState, RootState> = {
    [SET_QUICK_ACTION_INPUT]({ commit, dispatch }, input: string) {
        commit(SET_INPUT__MUTATION, input);
        dispatch(UPDATE_SEARCH_RESULTS);
    },
    [UPDATE_SEARCH_RESULTS]({ rootState, state, commit, dispatch }) {
        commit(RESET_SELECTED_RESULT);
        commit(RESET_SEARCH_RESULTS);

        const searchPhrase = state.input.toLowerCase();

        if (!searchPhrase) {
            console.warn('UPDATE_SEARCH_RESULTS: searchPhrase is empty');
            return;
        }

        const projects = findProjects(
            searchPhrase,
            rootState.projects.projects
        );

        const openTabs = findOpenTabs(searchPhrase, rootState.windows.windows);

        commit(SET_SEARCH_RESULTS, {
            projects,
            openTabs,
        });

        dispatch(SELECT_FIRST_RESULT);
    },
    [SELECT_FIRST_RESULT]({ commit, state }) {
        const searchResults = state.searchResults;
        const tabs = searchResults.openTabs;
        const projects = searchResults.projects;

        const firstResult = tabs.length ? tabs[0] : projects[0];

        commit(SET_SELECTED_RESULT, firstResult);
    },
    [SELECT_PREVIOUS_RESULT]({ commit, state }) {
        const selectedResult = state.selectedResult;

        if (!selectedResult) {
            console.error(
                'SELECT_PREVIOUS_RESULT not possible: no result selected'
            );
            return;
        }

        const allSearchResults = [
            ...state.searchResults.openTabs,
            ...state.searchResults.projects,
        ];

        if (allSearchResults.length < 2) {
            // either no results to select or there is only one result
            console.info(
                'SELECT_PREVIOUS_RESULT: results.length: ',
                allSearchResults.length
            );
            return;
        }

        const currentIndex = allSearchResults.findIndex(
            result => result === selectedResult
        );

        if (currentIndex === -1) {
            console.error(
                'SELECT_PREVIOUS_RESULT error: cannot find selected result: ',
                selectedResult
            );
            commit(SET_SELECTED_RESULT, allSearchResults[0]);
        } else if (currentIndex === 0) {
            commit(
                SET_SELECTED_RESULT,
                allSearchResults[allSearchResults.length - 1]
            );
        } else {
            commit(SET_SELECTED_RESULT, allSearchResults[currentIndex - 1]);
        }
    },
    [SELECT_NEXT_RESULT]({ commit, state }) {
        const selectedResult = state.selectedResult;

        if (!selectedResult) {
            console.error(
                'SELECT_NEXT_RESULT not possible: no result selected'
            );
            return;
        }

        const allSearchResults = [
            ...state.searchResults.openTabs,
            ...state.searchResults.projects,
        ];

        if (allSearchResults.length < 2) {
            // either no results to select or there is only one result
            console.info(
                'SELECT_NEXT_RESULT: results.length: ',
                allSearchResults.length
            );
            return;
        }

        const currentIndex = allSearchResults.findIndex(
            result => result === selectedResult
        );

        if (currentIndex === -1) {
            console.error(
                'SELECT_NEXT_RESULT error: cannot find selected result: ',
                selectedResult
            );
            commit(SET_SELECTED_RESULT, allSearchResults[0]);
            // todo: note: identical so far - refactor
        } else if (currentIndex === allSearchResults.length - 1) {
            commit(SET_SELECTED_RESULT, allSearchResults[0]);
        } else {
            commit(SET_SELECTED_RESULT, allSearchResults[currentIndex + 1]);
        }
    },
    [EXECUTE_QUICK_ACTION]({ state, dispatch, commit }) {
        const selectedResult = state.selectedResult;
        if (!selectedResult) {
            console.error(
                'EXECUTE_QUICK_ACTION not possible: no result selected'
            );
            return;
        }

        if (isSearchedOpenTabResult(selectedResult)) {
            dispatch(ACTIVATE_TAB, {
                tabId: selectedResult.tabId,
                windowId: selectedResult.windowId,
            });
        } else if (isSearchedProjectResult(selectedResult)) {
            const reviveParams = {
                projectId: selectedResult.projectId,
                ...(isSearchedProjectTab(selectedResult)
                    ? {
                          tabId: selectedResult.tabId,
                          windowId: selectedResult.windowId,
                      }
                    : {}),
            };

            dispatch(REVIVE_PROJECT, reviveParams);
        } else {
            console.error(
                'EXECUTE_QUICK_ACTION: unknown result type: ',
                selectedResult
            );
        }

        commit(RESET_SELECTED_RESULT);
        commit(RESET_SEARCH_RESULTS);
        commit(RESET_QUICK_ACTION_INPUT);
    },
};

const mutations: MutationTree<QuickActionsState> = {
    [SET_INPUT__MUTATION](state: QuickActionsState, input: string) {
        state.input = input;
    },
    [RESET_QUICK_ACTION_INPUT](state: QuickActionsState) {
        state.input = '';
    },
    [RESET_SEARCH_RESULTS](state: QuickActionsState) {
        state.searchResults = {
            projects: [],
            openTabs: [],
        };
    },
    [SET_SEARCH_RESULTS](
        state: QuickActionsState,
        results: QuickActionSearchResults
    ) {
        state.searchResults = results;
    },
    [SET_SELECTED_RESULT](
        state: QuickActionsState,
        selectedResult: SearchedProjectResult
    ) {
        state.selectedResult = selectedResult;
    },
    [RESET_SELECTED_RESULT](state: QuickActionsState) {
        state.selectedResult = null;
    },
};

const getters: GetterTree<QuickActionsState, RootState> = {
    [QUICK_ACTION_INPUT](state: QuickActionsState) {
        return state.input;
    },
    [SELECTED_RESULT](state: QuickActionsState) {
        return state.selectedResult;
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
                const searchResultsMatchingProjectId = state.searchResults.projects.filter(
                    searchResult => searchResult.projectId === currentProject.id
                );
                if (!searchResultsMatchingProjectId.length) {
                    return result;
                } else {
                    const filteredTabs = currentProject.tabs.filter(tab => {
                        return !!state.searchResults.projects.find(
                            searchResult =>
                                isSearchedProjectTab(searchResult) &&
                                searchResult.projectId === currentProject.id &&
                                searchResult.tabId === tab.id
                        );
                    });
                    const hiddenTabsCount =
                        currentProject.tabs.length - filteredTabs.length;

                    return [
                        ...result,
                        {
                            ...currentProject,
                            tabs: filteredTabs,
                            hiddenTabsCount,
                        },
                    ];
                }
            },
            [] as SearchedProjectAggregate[]
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
            [] as SearchedWindowAggregate[]
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
