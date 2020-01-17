<template>
    <div class="projects"></div>
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
}
</script>
