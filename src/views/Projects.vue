<template>
    <div class="projects">
        <b-card
            v-for="project in projects"
            v-bind:key="project.name"
            body-class="m-0 p-0"
            class="m-1"
        >
            <b-container
                class="project-header d-flex justify-content-between align-items-center"
                v-b-toggle="project.id"
            >
                <p class="project-name card-text">{{ project.name }}</p>
                <b-button variant="outline-primary" size="sm">
                    <b-icon icon="box-arrow-up-right" @click="revive(project)">
                    </b-icon>
                </b-button>
            </b-container>
            <b-collapse :id="project.id" class="tabs">
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

    // todo: move to store
    revive(project: Project) {
        const urlsByWindowId = project.tabs.reduce((urls, tab) => {
            let urlsArray: string[] = urls[tab.windowId || 0];
            if (urlsArray) {
                urls[tab.windowId || 0] = [...urlsArray, tab.url || ''];
            } else {
                urls[tab.windowId || 0] = [tab.url || ''];
            }

            return urls;
        }, {} as { [windowId: number]: string[] });

        Object.values(urlsByWindowId).forEach(urls => {
            browser.windows.create({ url: urls });
        });

        // todo: remove only if success
        this.$store.dispatch(REMOVE_PROJECT, project);
    }
}
</script>

<style scoped lang="scss">
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
</style>
