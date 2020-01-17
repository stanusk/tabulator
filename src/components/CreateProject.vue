<template>
    <div class="create-project">
        <b-form-input
            class="project-name"
            v-model="projectName"
            placeholder="Enter project name"
        >
        </b-form-input>

        <b-button @click="createProject(projectName)" variant="outline-primary">
            <b-icon icon="cloud-upload"> </b-icon>
        </b-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class CreateProject extends Vue {
    projectName: string = '';
    createProject(projectName: string) {
        this.$emit('create-project', projectName);
        this.projectName = '';
    }
}
</script>

<style scoped lang="scss">
.create-project {
    padding: 10px;
    display: flex;
    justify-content: space-around;

    .project-name {
        width: 250px;
    }
}
</style>
