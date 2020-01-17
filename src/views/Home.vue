<template>
    <div>
        <CreateProject @create-project="onCreateProject"> </CreateProject>
        <TabsList
            :tabs="tabs"
            :selectedTabs="selectedTabs"
            @close-tab="onCloseTab"
            @activate-tab="onActivateTab"
            @toggle-selected-tab="onToggleSelected"
        />
    </div>
</template>

<script lang="ts">
// @ is an alias to /src
import TabsList from '@/components/TabsList.vue';
import CreateProject from '@/components/CreateProject.vue';
import { Component, Vue } from 'vue-property-decorator';
import Tab = browser.tabs.Tab;
import { Project } from '@/typings';
import { ADD_PROJECT, DOWNLOAD_PROJECTS } from '@/store/action-types';
import { Getter } from 'vuex-class';
import { PROJECTS } from '@/store/getter-types';

@Component({
    components: {
        TabsList,
        CreateProject,
    },
})
export default class Home extends Vue {
    tabs: Tab[] = [];
    selectedTabs: Tab[] = [];

    @Getter(PROJECTS)
    projects!: Project[];

    created() {
        browser.tabs.query({}).then(tabs => {
            this.tabs = tabs as Tab[];
        });

        this.$store.dispatch(DOWNLOAD_PROJECTS);
    }

    onToggleSelected(tab: Tab) {
        const addTab = (addedTab: Tab) => {
            return [...this.selectedTabs, addedTab];
        };

        const removeTab = (removedTab: Tab) => {
            return this.selectedTabs.filter(t => t.id !== removedTab.id);
        };

        this.selectedTabs = this.selectedTabs.includes(tab)
            ? removeTab(tab)
            : addTab(tab);
    }

    onActivateTab(tabId: number) {
        browser.tabs.update(tabId, { active: true });
    }

    onCloseTab(closedTabsIds: number[]) {
        browser.tabs.remove(closedTabsIds).then(_ => {
            this.tabs = this.tabs.filter(
                tab => !closedTabsIds.includes(tab.id || 0)
            );
        });
    }

    onCreateProject(projectName: string) {
        this.addNewProject(projectName);
        this.onCloseTab(this.selectedTabs.map(tab => tab.id || 0));
        this.selectedTabs = [];
    }

    addNewProject(projectName: string) {
        const newProject = {
            name: projectName,
            tabs: this.selectedTabs,
        };
        this.$store.dispatch(ADD_PROJECT, newProject);
    }
}
</script>
