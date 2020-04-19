<template>
    <b-card body-class="m-0 p-0" class="project-card">
        <b-container
            class="project-header d-flex justify-content-between align-items-center"
        >
            <p class="project-name card-text">{{ project.name }}</p>
            <b-button
                @click.stop="revive"
                variant="outline-primary"
                size="sm"
                :class="{ active: isSelected(selectedResult, project.id) }"
            >
                <b-icon icon="box-arrow-up-right"> </b-icon>
            </b-button>
        </b-container>
        <b-list-group flush>
            <b-list-group-item
                class="m-1 p-1"
                v-for="tab in project.tabs"
                v-bind:key="tab.id"
                :class="{
                    active: isSelected(selectedResult, project.id, tab.id),
                }"
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
    </b-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import {
    SearchedOpenTabResult,
    SearchedProjectAggregate,
    SearchedProjectResult,
} from '@/typings';
import {
    isSearchedProjectResult,
    isSearchedProjectTab,
} from '@/store/helpers/helpers';

// TODO: consider moving to separate typings file
type SelectedResult = null | SearchedProjectResult | SearchedOpenTabResult;

@Component
export default class ProjectComponent extends Vue {
    @Prop()
    project!: SearchedProjectAggregate;

    @Prop({ default: null })
    selectedResult!: SelectedResult;

    @Emit('revive')
    revive() {}

    isSelected(
        selectedResult: SelectedResult,
        projectId: number,
        tabId?: number
    ) {
        if (!selectedResult || !isSearchedProjectResult(selectedResult)) {
            return false;
        }

        const isCorrectProject = selectedResult.projectId === projectId;

        if (!isCorrectProject) {
            return false;
        }

        const isSelectedProject = !isSearchedProjectTab(selectedResult);
        const isSelectedTab =
            isSearchedProjectTab(selectedResult) &&
            selectedResult.tabId === tabId;

        return isSelectedProject || isSelectedTab;
    }
}
</script>

<style scoped lang="scss">
.project-card {
    margin-top: 5px;

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
</style>
