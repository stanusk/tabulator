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
                v-for="project in searchResults.projects"
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
                        <b-list-group-item
                            class="m-1 p-1"
                            v-if="project.hiddenTabsCount > 0"
                        >
                            (+{{ project.hiddenTabsCount }} tabs)
                        </b-list-group-item>
                    </b-list-group>
                </b-collapse>
            </b-card>
        </div>

        <b-card
            v-for="bWindow in searchResults.windows"
            v-bind:key="bWindow.id"
            class="filtered-window"
        >
            <b-list-group flush>
                <b-list-group-item
                    button
                    v-for="tab of bWindow.tabs"
                    v-bind:key="tab.id"
                    @click="activateTab(tab.id, bWindow.id)"
                    class="tab p-2"
                >
                    {{ tab.title }}
                </b-list-group-item>

                <b-list-group-item
                    v-if="bWindow.hiddenTabsCount > 0"
                    class="tab p-2"
                >
                    (+{{ bWindow.hiddenTabsCount }} tabs)
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
    QUICK_ACTION_INPUT,
} from '@/store/getter-types';
import { AggregatedSearchResults } from '@/typings';
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
    @Getter(QUICK_ACTION_INPUT)
    searchInput!: string;

    @Getter(AGGREGATED_SEARCH_RESULTS)
    searchResults!: AggregatedSearchResults;

    executeQuickAction() {
        // todo
    }

    selectNextResult() {
        // todo
    }

    selectPreviousResult() {
        // todo
    }

    updateInput(input: string) {
        this.$store.dispatch(SET_QUICK_ACTION_INPUT, input);
    }

    activateTab(tabId: number, windowId: number) {
        this.$store.dispatch(ACTIVATE_TAB, { tabId, windowId });
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
