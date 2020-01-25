import { TabClean, WindowClean } from '@/typings';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import {
    ACTIVATE_TAB,
    CLOSE_SELECTED_TABS,
    CLOSE_TABS,
    LOAD_WINDOWS,
} from '@/store/action-types';
import {
    SELECT_TAB,
    DESELECT_TAB,
    RESET_SELECTED_TABS,
    SET_WINDOWS,
} from '@/store/mutation-types';
import { cleanWindow } from '@/store/helpers/helpers';
import { SELECTED_TABS, WINDOWS } from '@/store/getter-types';

const state = {
    windows: [] as WindowClean[],
    selectedTabs: [] as TabClean[],
};

const actions: ActionTree<WindowsState, RootState> = {
    [LOAD_WINDOWS]({ commit }) {
        return browser.windows.getAll({ populate: true }).then(windows => {
            commit(
                SET_WINDOWS,
                windows.map(bWindow => cleanWindow(bWindow))
            );
        });
    },
    [CLOSE_TABS]({ commit, state }, closedTabsIds: number[]) {
        browser.tabs.remove(closedTabsIds).then(
            _ => {
                const windowsWithoutClosedTabs = state.windows
                    // remove closed tabs
                    .map(win => {
                        return {
                            ...win,
                            tabs: win.tabs.filter(
                                tab => !closedTabsIds.includes(tab.id)
                            ),
                        };
                    })
                    // remove windows without tabs
                    .filter(win => !!win.tabs.length);
                commit(SET_WINDOWS, windowsWithoutClosedTabs);
            },
            err => {
                alert(
                    'closing tabs failed: ' +
                        err.message +
                        ' Please reopen the extension'
                );
            }
        );
    },
    [CLOSE_SELECTED_TABS]({ dispatch, state, commit }) {
        dispatch(
            CLOSE_TABS,
            state.selectedTabs.map(tab => tab.id)
        );
        commit(RESET_SELECTED_TABS);
    },
    [ACTIVATE_TAB]({ dispatch }, { tabId, windowId }) {
        browser.tabs.update(tabId, { active: true });
        browser.windows.update(windowId, { focused: true });
        dispatch(LOAD_WINDOWS);
    },
};

const mutations: MutationTree<WindowsState> = {
    [SET_WINDOWS](state: WindowsState, windows: WindowClean[]) {
        state.windows = windows;
    },
    [SELECT_TAB](state: WindowsState, tab: TabClean) {
        state.selectedTabs = [...state.selectedTabs, tab];
    },
    [DESELECT_TAB](state: WindowsState, tabId: number) {
        state.selectedTabs = state.selectedTabs.filter(t => t.id !== tabId);
    },
    [RESET_SELECTED_TABS](state: WindowsState) {
        state.selectedTabs = [];
    },
};

const getters: GetterTree<WindowsState, RootState> = {
    [WINDOWS](state: WindowsState) {
        return state.windows;
    },
    [SELECTED_TABS](state: WindowsState) {
        return state.selectedTabs;
    },
};

export type WindowsState = typeof state;

export const windows: Module<WindowsState, RootState> = {
    state,
    actions,
    mutations,
    getters,
};
