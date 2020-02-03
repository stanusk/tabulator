<template>
    <div class="create-project">
        <b-form-input
            class="project-name"
            :value="projectName"
            @blur="updateProjectName($event)"
            placeholder="Project name"
            :autofocus="true"
        >
        </b-form-input>

        <b-button
            @click="createProject()"
            variant="primary"
            :disabled="disabled"
        >
            <b-icon icon="archive-fill"> </b-icon>
        </b-button>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CreateProject extends Vue {
    @Prop({ default: false })
    disabled!: boolean;

    @Prop({ default: '' })
    projectName!: string;

    @Emit('create-project')
    createProject() {}

    @Emit('update-project-name')
    updateProjectName(event: FocusEvent) {
        return (event.target as HTMLInputElement).value;
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
