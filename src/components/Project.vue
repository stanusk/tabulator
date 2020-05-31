<template>
    <q-card square class="project-card">
        <q-card-section
            :class="{
                'bg-primary text-white': isSelected(selectedResult, project.id),
            }"
            @click="expanded = !expanded"
            class="project-header"
        >
            <p class="project-name">{{ project.name }}</p>

            <q-btn
                :color="isSelected(selectedResult, project.id) ? '' : 'primary'"
                @click.stop="revive"
                icon="launch"
                size="sm"
                flat
                round
            >
            </q-btn>
        </q-card-section>
        <q-slide-transition>
            <!-- todo: use window -->
            <q-list separator bordered v-show="expanded" class="tabs">
                <q-item
                    v-for="tab in project.tabs"
                    v-bind:key="tab.id"
                    :active="isSelected(selectedResult, project.id, tab.id)"
                >
                    <q-item-section>{{ tab.title }}</q-item-section>
                </q-item>
                <q-item v-if="hiddenTabsCount > 0">
                    <q-item-section>
                        (+{{ hiddenTabsCount }} tabs)
                    </q-item-section>
                </q-item>
            </q-list>
        </q-slide-transition>
    </q-card>
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
        display: flex;
        align-items: center;
        justify-content: space-between;

        cursor: pointer;

        .project-name {
            margin: 0;
            font-size: 1.1rem;
        }
    }

    .tabs {
        text-align: left;
        font-size: 0.9rem;
    }
}
</style>
