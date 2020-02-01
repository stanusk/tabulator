<template>
    <div>
        <DevHelpers></DevHelpers>
        <CreateProject
            @create-project="onCreateProject"
            :disabled="selectedTabs.length === 0"
        >
        </CreateProject>
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
    CREATE_PROJECT,
    CLOSE_TABS,
    DOWNLOAD_PROJECTS,
    LOAD_WINDOWS,
    ACTIVATE_TAB,
} from '@/store/action-types';
import { TabClean, WindowClean } from '@/typings';
import DevHelpers from '@/components/DevHelpers.vue';
import { Getter } from 'vuex-class';
import { SELECTED_TABS, WINDOWS } from '@/store/getter-types';
import { DESELECT_TAB, SELECT_TAB } from '@/store/mutation-types';

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

    onToggleSelected({
        tab,
        isSelected,
    }: {
        tab: TabClean;
        isSelected: boolean;
    }) {
        isSelected
            ? this.$store.commit(DESELECT_TAB, tab.id)
            : this.$store.commit(SELECT_TAB, tab);
    }

    onActivateTab({ tabId, windowId }: { tabId: number; windowId: number }) {
        this.$store.dispatch(ACTIVATE_TAB, { tabId, windowId });
    }

    onCloseTab(closedTabsIds: number[]) {
        this.$store.dispatch(CLOSE_TABS, closedTabsIds);
    }

    onCreateProject(projectName: string) {
        this.$store.dispatch(CREATE_PROJECT, projectName);
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
