<template>
    <div class="quick-action">
        <quick-action-input
            :q-input="searchInput"
            @update-quick-action-input="updateInput($event)"
            @execute-quick-action="executeQuickAction"
            @select-next-result="selectNextResult"
            @select-previous-result="selectPreviousResult"
        ></quick-action-input>

        <window-component
            v-for="bWindow in searchResults.windows"
            v-bind:key="bWindow.id"
            :b-window="bWindow"
            :selected-result="selectedResult"
            :hidden-tabs-count="bWindow.hiddenTabsCount"
            @activate-tab="activateTab"
        ></window-component>

        <project-component
            v-for="project in searchResults.projects"
            v-bind:key="project.id"
            :project="project"
            :selected-result="selectedResult"
            :hidden-tabs-count="project.hiddenTabsCount"
            :hidden-windows-count="project.hiddenWindowsCount"
            :expanded="true"
            @revive="revive"
        ></project-component>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import {
    AGGREGATED_SEARCH_RESULTS,
    QUICK_ACTION_INPUT,
    SELECTED_RESULT,
} from '@/store/getter-types';
import {
    AggregatedSearchResults,
    SearchedTabResult,
    SearchedProjectResult,
} from '@/typings';
import {
    ACTIVATE_TAB,
    EXECUTE_QUICK_ACTION,
    REVIVE_PROJECT,
    SELECT_NEXT_RESULT,
    SELECT_PREVIOUS_RESULT,
    SET_QUICK_ACTION_INPUT,
} from '@/store/action-types';
import QuickActionInput from '@/components/QuickActionInput.vue';
import ProjectComponent from '@/components/Project.vue';
import WindowComponent from '@/components/Window.vue';

@Component({
    components: {
        QuickActionInput,
        ProjectComponent,
        WindowComponent,
    },
})
export default class QuickAction extends Vue {
    @Getter(QUICK_ACTION_INPUT)
    searchInput!: string;

    @Getter(AGGREGATED_SEARCH_RESULTS)
    searchResults!: AggregatedSearchResults;

    @Getter(SELECTED_RESULT)
    selectedResult!: null | SearchedProjectResult | SearchedTabResult;

    executeQuickAction() {
        this.$store.dispatch(EXECUTE_QUICK_ACTION);
    }

    selectNextResult() {
        this.$store.dispatch(SELECT_NEXT_RESULT);
    }

    selectPreviousResult() {
        this.$store.dispatch(SELECT_PREVIOUS_RESULT);
    }

    updateInput(input: string) {
        this.$store.dispatch(SET_QUICK_ACTION_INPUT, input);
    }

    activateTab({ tabId, windowId }: { tabId: number; windowId: number }) {
        this.$store.dispatch(ACTIVATE_TAB, { tabId, windowId });
    }

    revive(reviveConfig: {
        projectId: number;
        windowId?: number;
        tabId?: number;
    }) {
        this.$store.dispatch(REVIVE_PROJECT, reviveConfig);
    }
}
</script>

<style scoped lang="scss"></style>
