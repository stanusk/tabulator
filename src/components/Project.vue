<template>
    <b-card body-class="m-0 p-0" class="project-card">
        <b-container
            class="project-header d-flex justify-content-between align-items-center"
            v-b-toggle="`${project.id}`"
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
        <b-collapse :visible="expanded" :id="`${project.id}`" class="tabs">
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
                <b-list-group-item class="m-1 p-1" v-if="hiddenTabsCount > 0">
                    (+{{ hiddenTabsCount }} tabs)
                </b-list-group-item>
            </b-list-group>
        </b-collapse>
    </b-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { Project, SelectedResult } from '@/typings';
import {
    isSearchedProjectResult,
    isSearchedProjectTab,
} from '@/store/helpers/helpers';

@Component
export default class ProjectComponent extends Vue {
    @Prop()
    project!: Project;

    @Prop({ default: null })
    selectedResult!: SelectedResult;

    @Prop({ default: 0 })
    hiddenTabsCount!: number;

    @Prop({ default: false })
    expanded!: boolean;

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

        const isSelectedProject = selectedResult.projectId === projectId;
        if (!isSelectedProject) {
            return false;
        }

        const isSearchingForProject =
            !isSearchedProjectTab(selectedResult) && !tabId;
        if (isSearchingForProject) {
            return true;
        }

        return (
            isSearchedProjectTab(selectedResult) &&
            selectedResult.tabId === tabId
        );
    }
}
</script>

<style scoped lang="scss">
.project-card {
    margin-top: 5px;

    .project-header {
        padding: 5px;
        background-color: rgba(40, 167, 69, 0.25);
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
