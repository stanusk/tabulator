import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import {
    UPDATE_SEARCH_RESULTS,
    SET_QUICK_ACTION_INPUT,
} from '@/store/action-types';
import { SET_QUICK_ACTION_INPUT as SET_INPUT__MUTATION } from '@/store/mutation-types';
import { QUICK_ACTION_INPUT } from '@/store/getter-types';

const state = {
    input: '' as string,
};

const actions: ActionTree<QuickActionsState, RootState> = {
    [SET_QUICK_ACTION_INPUT]({ commit, dispatch }, input: string) {
        commit(SET_INPUT__MUTATION, input);
        dispatch(UPDATE_SEARCH_RESULTS);
    },
    [UPDATE_SEARCH_RESULTS]({ rootState, state }) {
        // todo next
    },
};

const mutations: MutationTree<QuickActionsState> = {
    [SET_INPUT__MUTATION](state: QuickActionsState, input: string) {
        state.input = input;
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
