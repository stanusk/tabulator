<template>
    <div class="projects">
        <b-card
            v-for="project in projects"
            v-bind:key="project.name"
            body-class="m-0 p-0"
            v-b-toggle.collapse-1-inner
        >
            <b-container
                class="project-header d-flex justify-content-between align-items-center"
            >
                <p class="project-name card-text">{{ project.name }}</p>
                <b-button variant="outline-primary" size="sm">
                    <b-icon icon="box-arrow-up-right" @click="revive(project)">
                    </b-icon>
                </b-button>
            </b-container>
            <b-collapse id="collapse-1-inner" class="tabs">
                <b-list-group flush>
                    <b-list-group-item
                        class="m-1 p-1"
                        v-for="tab in project.tabs"
                        v-bind:key="tab.id"
                        >{{ tab.title }}</b-list-group-item
                    >
                </b-list-group>
            </b-collapse>
        </b-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Project } from '@/typings';
import { Getter } from 'vuex-class';
import { PROJECTS } from '@/store/getter-types';
import { REMOVE_PROJECT } from '@/store/action-types';

@Component
export default class Projects extends Vue {
    @Getter(PROJECTS)
    projects!: Project[];

    revive(project: Project) {
        const urls: string[] = project.tabs.map(tab => {
            const url = tab.url || '';
            const urlTargetIndex = url.indexOf('http');

            return url.substring(urlTargetIndex);
        });
        browser.windows.create({ url: urls });

        this.$store.dispatch(REMOVE_PROJECT, project);
    }
}
</script>

<style scoped lang="scss">
.projects {
    padding: 5px;
    .project-header {
        padding: 5px;
        background-color: azure;
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
