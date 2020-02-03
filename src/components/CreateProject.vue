<template>
    <div class="create-project">
        <b-form-input
            class="project-name"
            v-model="projectName"
            placeholder="Project name"
        >
        </b-form-input>

        <b-button
            @click="createProject(projectName)"
            variant="primary"
            :disabled="disabled"
        >
            <b-icon icon="archive-fill"> </b-icon>
        </b-button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CreateProject extends Vue {
    @Prop()
    disabled!: boolean;

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
