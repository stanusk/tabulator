<template>
    <div>
        <!--<DevHelpers></DevHelpers>-->
        <create-project
            :disabled="selectedTabs.length === 0"
            :projectName="newProjectName"
            @update-project-name="onUpdateProjectName"
            @create-project="onCreateProject"
        >
        </create-project>

        <window-component
            v-for="bWindow in bWindows"
            v-bind:key="bWindow.id"
            :b-window="bWindow"
            @activate-tab="onActivateTab"
        >
            <template v-slot:tabActions="slotProps">
                <tab-action-buttons
                    :tab="slotProps.tab"
                    :is-selected="isSelected(slotProps.tab.id)"
                    @close-tab="onCloseTab"
                    @toggle-selected="onToggleSelected"
                ></tab-action-buttons>
            </template>
        </window-component>
    </div>
</template>

<script lang="ts">
import CreateProject from '@/components/CreateProject.vue';
import { Component, Vue } from 'vue-property-decorator';
import { CREATE_PROJECT, CLOSE_TABS, ACTIVATE_TAB } from '@/store/action-types';
import { TabClean, TabSelectionModifiers, WindowClean } from '@/typings';
import DevHelpers from '@/components/DevHelpers.vue';
import { Getter } from 'vuex-class';
import { NEW_PROJECT_NAME, SELECTED_TABS, WINDOWS } from '@/store/getter-types';
import {
    DESELECT_ALL_WINDOW_TABS,
    DESELECT_TAB,
    SELECT_ALL_WINDOW_TABS,
    SELECT_TAB,
    SET_NEW_PROJECT_NAME,
} from '@/store/mutation-types';
import WindowComponent from '@/components/Window.vue';
import TabActionButtons from '@/components/TabActionButtons.vue';

@Component({
    components: {
        CreateProject,
        DevHelpers,
        WindowComponent,
        TabActionButtons,
    },
})
export default class Tabs extends Vue {
    @Getter(WINDOWS)
    bWindows!: WindowClean[];

    @Getter(SELECTED_TABS)
    selectedTabs!: TabClean[];

    @Getter(NEW_PROJECT_NAME)
    newProjectName!: string;

    onToggleSelected({
        tab,
        isSelected,
        modifiers,
    }: {
        tab: TabClean;
        isSelected: boolean;
        modifiers: TabSelectionModifiers;
    }) {
        if (!isSelected) {
            switch (true) {
                case modifiers.altKey: {
                    this.$store.commit(SELECT_ALL_WINDOW_TABS, tab.windowId);
                    break;
                }
                default: {
                    this.$store.commit(SELECT_TAB, tab);
                }
            }
        } else {
            switch (true) {
                case modifiers.altKey: {
                    this.$store.commit(DESELECT_ALL_WINDOW_TABS, tab.windowId);
                    break;
                }
                default: {
                    this.$store.commit(DESELECT_TAB, tab.id);
                }
            }
        }
    }

    onActivateTab({ tabId, windowId }: { tabId: number; windowId: number }) {
        this.$store.dispatch(ACTIVATE_TAB, { tabId, windowId });
    }

    onCloseTab(closedTabsId: number) {
        this.$store.dispatch(CLOSE_TABS, [closedTabsId]);
    }

    onCreateProject() {
        this.$store.dispatch(CREATE_PROJECT);
    }

    onUpdateProjectName(updatedName: string) {
        this.$store.commit(SET_NEW_PROJECT_NAME, updatedName);
    }

    isSelected(tabId: number) {
        return this.selectedTabs.find(t => t.id === tabId) !== undefined;
    }
}
</script>

<style scoped lang="scss">
.card {
    margin-top: 5px;
    border: 2px solid rgba(0, 0, 0, 0.225);
    .card-body {
        padding: 0;
    }
}
</style>
