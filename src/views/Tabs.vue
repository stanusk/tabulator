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
            <!--            todo: move to TabActionButtons or some such-->
            <template v-slot:tabActions="slotProps">
                <div class="tab-title-buttons">
                    <b-icon
                        :icon="isSelected(slotProps.tab) ? 'star-fill' : 'star'"
                        variant="primary"
                        @click.stop="
                            toggleSelected(
                                slotProps.tab,
                                isSelected(slotProps.tab),
                                $event
                            )
                        "
                        class="h3 m-0"
                    >
                    </b-icon>

                    <b-icon
                        icon="x"
                        variant="danger"
                        @click.stop="onCloseTab(slotProps.tab.id)"
                        class="h3 m-0"
                    >
                    </b-icon>
                </div>
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
import { pick } from 'lodash-es';

@Component({
    components: {
        CreateProject,
        DevHelpers,
        WindowComponent,
    },
})
export default class Tabs extends Vue {
    @Getter(WINDOWS)
    bWindows!: WindowClean[];

    @Getter(SELECTED_TABS)
    selectedTabs!: TabClean[];

    @Getter(NEW_PROJECT_NAME)
    newProjectName!: string;

    toggleSelected(tab: TabClean, isSelected: boolean, event: MouseEvent) {
        const modifiers = pick(event, [
            'ctrlKey',
            'shiftKey',
            'altKey',
            'metaKey',
        ]);
        this.onToggleSelected({ tab, isSelected, modifiers });
    }

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

    isSelected(tab: TabClean) {
        return this.selectedTabs.find(t => t.id === tab.id) !== undefined;
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

    .tab-title-buttons {
        display: flex;
    }
}
</style>
