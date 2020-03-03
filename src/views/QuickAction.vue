<template>
    <div class="quick-action">
        <quick-action-input
            :q-input="searchInput"
            @update-quick-action-input="updateInput($event)"
            @execute-quick-action="executeQuickAction"
            @select-next-result="selectNextResult"
            @select-previous-result="selectPreviousResult"
        ></quick-action-input>

        <div class="projects">
            <b-card
                v-for="project in filteredProjects"
                v-bind:key="project.name"
                body-class="m-0 p-0"
                class="m-1"
            >
                <b-container
                    class="project-header d-flex justify-content-between align-items-center"
                    v-b-toggle="`${project.id}`"
                >
                    <p class="project-name card-text">{{ project.name }}</p>
                    <b-button
                        @click.stop="revive(project.id)"
                        variant="outline-primary"
                        size="sm"
                    >
                        <b-icon icon="box-arrow-up-right"> </b-icon>
                    </b-button>
                </b-container>
                <b-collapse :id="`${project.id}`" class="tabs">
                    <b-list-group flush>
                        <b-list-group-item
                            class="m-1 p-1"
                            v-for="tab in project.tabs"
                            v-bind:key="tab.id"
                        >
                            {{ tab.title }}
                        </b-list-group-item>
                    </b-list-group>
                </b-collapse>
            </b-card>
        </div>

        <b-card
            v-for="(bWindow, windowIndex) in searchResults.windows"
            v-bind:key="bWindow.id"
            class="filtered-window"
        >
            <b-list-group flush>
                <b-list-group-item
                    button
                    v-for="(tab, tabIndex) of bWindow.tabs"
                    v-bind:key="tab.id"
                    @click="activateTab(tab.id, bWindow.id)"
                    class="tab p-2"
                    :class="{
                        active:
                            tabIndex === selectedTabIndex &&
                            windowIndex === selectedWindowIndex,
                    }"
                >
                    {{ tab.title }}
                </b-list-group-item>

                <b-list-group-item
                    v-if="bWindow.hiddenTabsCount > 0"
                    class="tab p-2"
                >
                    (+{{ bWindow.hiddenTabsCount }} more tabs)
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import {
    AGGREGATED_SEARCH_RESULTS,
    PROJECTS,
    QUICK_ACTION_INPUT,
    WINDOWS,
} from '@/store/getter-types';
import {
    AggregatedSearchResults,
    Project,
    TabClean,
    WindowClean,
} from '@/typings';
import TabsList from '@/components/TabsList.vue';
import {
    ACTIVATE_TAB,
    REVIVE_PROJECT,
    SET_QUICK_ACTION_INPUT,
} from '@/store/action-types';
import QuickActionInput from '@/components/QuickActionInput.vue';

@Component({
    components: {
        TabsList,
        QuickActionInput,
    },
})
export default class QuickAction extends Vue {
    @Getter(WINDOWS)
    bWindows!: WindowClean[];

    @Getter(PROJECTS)
    projects!: Project[];

    @Getter(QUICK_ACTION_INPUT)
    searchInput!: string;

    @Getter(AGGREGATED_SEARCH_RESULTS)
    searchResults!: AggregatedSearchResults;

    selectedTabIndex: number = 0;
    selectedWindowIndex: number = 0;

    get filteredWindows(): WindowClean[] {
        if (this.searchInput === '') {
            return [];
        }

        this.selectedTabIndex = 0;
        this.selectedWindowIndex = 0;

        return this.bWindows.reduce((filteredWindows, currentWindow) => {
            const windowWithFilteredTabs = this.filterWindow(
                currentWindow,
                this.searchInput
            );

            return windowWithFilteredTabs
                ? [...filteredWindows, windowWithFilteredTabs]
                : filteredWindows;
        }, [] as WindowClean[]);
    }

    get filteredProjects(): Project[] {
        if (this.searchInput === '') {
            return [];
        }

        return this.projects.reduce((filteredProjects, currentProject) => {
            const projectWithFilteredTabs = this.filterProject(
                currentProject,
                this.searchInput
            );

            return projectWithFilteredTabs
                ? [...filteredProjects, projectWithFilteredTabs]
                : filteredProjects;
        }, [] as Project[]);
    }

    executeQuickAction() {
        const selectedWindow = this.filteredWindows[this.selectedWindowIndex];
        const selectedTab = selectedWindow.tabs[this.selectedTabIndex];
        this.activateTab(selectedTab.id, selectedWindow.id);
    }

    selectNextResult() {
        const selectedWindow = this.filteredWindows[this.selectedWindowIndex];
        if (selectedWindow.tabs.length > this.selectedTabIndex + 1) {
            this.selectNextTab();
        } else if (this.filteredWindows.length > this.selectedWindowIndex + 1) {
            this.selectNextWindow();
        }
    }

    selectPreviousResult() {
        if (this.selectedTabIndex > 0) {
            this.selectPreviousTab();
        } else if (this.selectedWindowIndex > 0) {
            this.selectPreviousWindow();
        }
    }

    private selectNextTab() {
        this.selectedTabIndex++;
    }

    private selectPreviousTab() {
        this.selectedTabIndex--;
    }

    private selectNextWindow() {
        this.selectedWindowIndex++;
        this.selectedTabIndex = 0;
    }

    private selectPreviousWindow() {
        this.selectedWindowIndex--;
        const selectedWindow = this.filteredWindows[this.selectedWindowIndex];

        this.selectedTabIndex = selectedWindow.tabs.length - 1;
    }

    updateInput(input: string) {
        this.$store.dispatch(SET_QUICK_ACTION_INPUT, input);
    }

    activateTab(tabId: number, windowId: number) {
        this.$store.dispatch(ACTIVATE_TAB, { tabId, windowId });
    }

    findTabsContainingText(text: string, tabs: TabClean[]) {
        return tabs.filter(tab => {
            return `${tab.title}${tab.url}`.indexOf(text) > -1;
        });
    }

    filterWindow(window: WindowClean, text: string): WindowClean | null {
        const windowWithFilteredTabs = {
            ...window,
            tabs: this.findTabsContainingText(text, window.tabs),
        };

        return windowWithFilteredTabs.tabs.length
            ? windowWithFilteredTabs
            : null;
    }

    filterProject(project: Project, text: string): Project | null {
        const projectWithFilteredTabs = {
            ...project,
            tabs: this.findTabsContainingText(text, project.tabs),
        };

        return projectWithFilteredTabs.tabs.length
            ? projectWithFilteredTabs
            : null;
    }

    revive(projectId: number) {
        this.$store.dispatch(REVIVE_PROJECT, projectId);
    }
}
</script>

<style scoped lang="scss">
.quick-action {
    margin: 10px;

    .filtered-window {
        margin-top: 5px;
        border: 2px solid rgba(0, 0, 0, 0.225);
        .card-body {
            padding: 0;
        }
        .tab {
            font-size: 0.9rem;
            text-align: left;
        }

        &.filtered-window {
            border-color: rebeccapurple;
        }
    }

    .projects {
        .project-header {
            padding: 5px;
            background-color: azure;
            cursor: pointer;
            .project-name {
                margin: auto 0;
                font-weight: bold;
            }
        }
        .tabs {
            border-top: 1px solid lightgrey;
            font-size: 0.8rem;
        }
    }
}
</style>
