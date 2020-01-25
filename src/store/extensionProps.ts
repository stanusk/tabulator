import { Module, MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import { SET_LAST_PROJECT_ID } from '@/store/mutation-types';

const state = {
    lastProjectId: 0,
};

const mutations: MutationTree<ExtensionPropsState> = {
    [SET_LAST_PROJECT_ID](state: ExtensionPropsState, newProjectId: number) {
        state.lastProjectId = newProjectId;
    },
};

export type ExtensionPropsState = typeof state;

export const extensionProps: Module<ExtensionPropsState, RootState> = {
    state,
    mutations,
};
