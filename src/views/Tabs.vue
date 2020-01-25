<template>
    <div>
        <DevHelpers></DevHelpers>
        <CreateProject @create-project="addNewProject"> </CreateProject>
        <b-card v-for="bWindow in bWindows" v-bind:key="bWindow.id">
            <TabsList
                :tabs="bWindow.tabs"
                :selectedTabs="selectedTabs"
                @close-tab="onCloseTab($event)"
                @activate-tab="onActivateTab"
                @toggle-selected-tab="onToggleSelected"
            />
        </b-card>
    </div>
</template>

<script lang="ts">
// @ is an alias to /src
import TabsList from '@/components/TabsList.vue';
import CreateProject from '@/components/CreateProject.vue';
import { Component, Vue } from 'vue-property-decorator';
import {
    ADD_PROJECT,
    CLOSE_TABS,
    DESELECT_TAB,
    DOWNLOAD_PROJECTS,
    LOAD_WINDOWS,
    SELECT_TAB,
} from '@/store/action-types';
import { TabClean, WindowClean } from '@/typings';
import { uniqueId } from 'lodash-es';
import DevHelpers from '@/components/DevHelpers.vue';
import { Getter } from 'vuex-class';
import { SELECTED_TABS, WINDOWS } from '@/store/getter-types';

@Component({
    components: {
        TabsList,
        CreateProject,
        DevHelpers,
    },
})
export default class Tabs extends Vue {
    @Getter(WINDOWS)
    bWindows!: WindowClean[];

    @Getter(SELECTED_TABS)
    selectedTabs!: TabClean[];

    created() {
        this.$store.dispatch(LOAD_WINDOWS);
        this.$store.dispatch(DOWNLOAD_PROJECTS);
    }

    onToggleSelected(tab: TabClean) {
        this.selectedTabs.includes(tab)
            ? this.$store.dispatch(DESELECT_TAB, tab.id)
            : this.$store.dispatch(SELECT_TAB, tab);
    }

    onActivateTab(tabId: number) {
        browser.tabs.update(tabId, { active: true });
    }

    onCloseTab(closedTabsIds: number[]) {
        this.$store.dispatch(CLOSE_TABS, closedTabsIds);
    }

    addNewProject(projectName: string) {
        const newProject = {
            // todo: change id logic to prevent overwrite (add IDs as project counter to storage and keep incrementing)
            id: uniqueId('proj_'),
            name: projectName,
            tabs: this.selectedTabs,
        };
        this.$store.dispatch(ADD_PROJECT, newProject);
    }
}
</script>

<style scoped lang="scss">
.card {
    margin: 5px 5px 12px;
    border: 2px solid rgba(0, 0, 0, 0.225);
    .card-body {
        padding: 0;
    }
}
</style>
