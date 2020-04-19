<template>
    <div class="projects">
        <project-component
            v-for="project in projectsSorted"
            v-bind:key="project.id"
            :project="project"
            @revive="revive(project.id)"
        ></project-component>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Project } from '@/typings';
import { Getter } from 'vuex-class';
import { PROJECTS } from '@/store/getter-types';
import { REVIVE_PROJECT } from '@/store/action-types';
import ProjectComponent from '@/components/Project.vue';

@Component({ components: { ProjectComponent } })
export default class Projects extends Vue {
    @Getter(PROJECTS)
    projects!: Project[];

    get projectsSorted() {
        return this.projects.sort((a, b) => b.id - a.id);
    }

    revive(projectId: number) {
        this.$store.dispatch(REVIVE_PROJECT, { projectId });
    }
}
</script>

<style scoped lang="scss"></style>
