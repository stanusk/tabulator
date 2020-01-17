<template>
    <div>
        <CreateProject @create-project="onCreateProject"> </CreateProject>
        <b-card v-for="bWindow in bWindows" v-bind:key="bWindow.id">
            <TabsList
                :tabs="bWindow.tabs"
                :selectedTabs="selectedTabs"
                @close-tab="onCloseTab($event, bWindow)"
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
import Tab = browser.tabs.Tab;
import Window = browser.windows.Window;
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
    bWindows: Window[] = [];
    selectedTabs: Tab[] = [];

    @Getter(PROJECTS)
    projects!: Project[];

    created() {
        browser.windows.getAll({ populate: true }).then(windows => {
            this.bWindows = windows;
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

    onCloseTab(closedTabsIds: number[], bWindow?: Window) {
        browser.tabs.remove(closedTabsIds).then(_ => {
            // remove closed tabs
            this.bWindows.forEach(bWindow => {
                bWindow.tabs = bWindow.tabs?.filter(
                    tab => !closedTabsIds.includes(tab.id || 0)
                );
            });

            // remove windows without tabs
            if (bWindow && !bWindow.tabs?.length) {
                this.bWindows = this.bWindows.filter(w => w.id !== bWindow.id);
            } else {
                this.bWindows = this.bWindows.reduce((all, current) => {
                    return current.tabs?.length ? [...all, current] : all;
                }, [] as Window[]);
            }
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

<style scoped lang="scss">
.card {
    margin: 5px 5px 12px;
    border: 2px solid rgba(0, 0, 0, 0.225);
    .card-body {
        padding: 0;
    }
}
</style>
