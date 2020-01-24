import { WindowClean } from '@/typings';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import { LOAD_WINDOWS } from '@/store/action-types';
import { SET_WINDOWS } from '@/store/mutation-types';
import { cleanWindow } from '@/store/helpers/helpers';
import { WINDOWS } from '@/store/getter-types';

const state = {
    windows: [] as WindowClean[],
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
};

const mutations: MutationTree<WindowsState> = {
    [SET_WINDOWS](state: WindowsState, windows: WindowClean[]) {
        state.windows = windows;
    },
};

const getters: GetterTree<WindowsState, RootState> = {
    [WINDOWS](state: WindowsState) {
        return state.windows;
    },
};

export type WindowsState = typeof state;

export const windows: Module<WindowsState, RootState> = {
    state,
    actions,
    mutations,
    getters,
};
