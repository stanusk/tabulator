<template>
    <div class="projects">
        <b-list-group>
            <b-list-group-item
                v-for="project in projects"
                v-bind:key="project.name"
                class="d-flex justify-content-between align-items-center"
            >
                <span>{{ project.name }}</span>
                <b-button variant="outline-primary">
                    <b-icon icon="box-arrow-up-right" @click="revive(project)">
                    </b-icon>
                </b-button>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Project } from '@/typings';

@Component
export default class Projects extends Vue {
    projects: Project[] = [];
    created(): void {
        browser.storage.sync.get('projects').then(result => {
            this.projects = JSON.parse(result.projects);
        });
    }

    revive(project: Project) {
        const urls: string[] = project.tabs.map(tab => {
            const url = tab.url || '';
            const urlTargetIndex = url.indexOf('http');

            return url.substring(urlTargetIndex);
        });
        browser.windows.create({ url: urls });

        this.projects = this.projects.filter(p => p.name !== project.name);
        this.uploadStoredProjects();
    }

    // todo: unify with uploadStoredProjects in Home.vue
    uploadStoredProjects() {
        const projectsString = JSON.stringify(this.projects);
        browser.storage.sync.set({ projects: projectsString });
    }
}
</script>
