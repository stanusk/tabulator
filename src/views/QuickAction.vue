<template>
    <div class="quick-action">
        <b-form-input
            class="search-input"
            placeholder="Searched project or tab"
            v-model="searchInput"
            debounce="500"
            :autofocus="true"
            @keydown="onKeydown($event)"
        >
        </b-form-input>

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
                        @click="revive(project)"
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
            v-for="(bWindow, windowIndex) in filteredWindows"
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
            </b-list-group>
        </b-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { PROJECTS, WINDOWS } from '@/store/getter-types';
import { Project, TabClean, WindowClean } from '@/typings';
import TabsList from '@/components/TabsList.vue';
import { ACTIVATE_TAB, REVIVE_PROJECT } from '@/store/action-types';

@Component({
    components: {
        TabsList,
    },
})
export default class QuickAction extends Vue {
    @Getter(WINDOWS)
    bWindows!: WindowClean[];

    @Getter(PROJECTS)
    projects!: Project[];

    searchInput: string = '';
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

    onKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter': {
                const selectedWindow = this.filteredWindows[
                    this.selectedWindowIndex
                ];
                const selectedTab = selectedWindow.tabs[this.selectedTabIndex];
                this.activateTab(selectedTab.id, selectedWindow.id);
                break;
            }
            case 'ArrowDown': {
                event.stopPropagation();
                event.preventDefault();
                const selectedWindow = this.filteredWindows[
                    this.selectedWindowIndex
                ];
                if (selectedWindow.tabs.length > this.selectedTabIndex + 1) {
                    this.selectNextTab();
                } else if (
                    this.filteredWindows.length >
                    this.selectedWindowIndex + 1
                ) {
                    this.selectNextWindow();
                }
                break;
            }
            case 'ArrowUp': {
                event.stopPropagation();
                event.preventDefault();
                if (this.selectedTabIndex > 0) {
                    this.selectPreviousTab();
                } else if (this.selectedWindowIndex > 0) {
                    this.selectPreviousWindow();
                }
                break;
            }
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

    // todo: revive by projectId
    revive(project: Project) {
        this.$store.dispatch(REVIVE_PROJECT, project);
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
