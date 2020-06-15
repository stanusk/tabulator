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
            <div v-show="isExpanded">
                <window-component
                    v-for="bWindow in project.windows"
                    v-bind:key="bWindow.id"
                    :b-window="bWindow"
                    :selected-result="selectedResult"
                    :hidden-tabs-count="bWindow.hiddenTabsCount"
                    @activate-tab="revive"
                ></window-component>
                <q-list separator bordered>
                    <q-item v-if="hiddenWindowsCount > 0">
                        <q-item-section>
                            ({{ hiddenTabsCount }} tabs in
                            {{ hiddenWindowsCount }} windows)
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
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
import WindowComponent from '@/components/Window.vue';

@Component({ components: { WindowComponent } })
export default class ProjectComponent extends Vue {
    @Prop()
    project!: Project;

    @Prop({ default: null })
    selectedResult!: SelectedResult;

    @Prop({ default: false })
    expandedInit!: boolean;

    @Prop({ default: 0 })
    hiddenTabsCount!: number;

    @Prop({ default: 0 })
    hiddenWindowsCount!: number;

    @Emit('revive')
    revive(event: MouseEvent | { windowId: number; tabId: number }) {
        const reviveConfig = { projectId: this.project.id };

        return 'windowId' in event
            ? { ...reviveConfig, ...event }
            : reviveConfig;
    }

    get isExpanded() {
        return this.expandedInit || this.expanded;
    }

    expanded = false;

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
}
</style>
