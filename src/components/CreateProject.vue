<template>
    <div class="create-project">
        <b-form-input
            class="project-name"
            placeholder="Project name"
            :value="projectName"
            :autofocus="true"
            @input="updateProjectName($event)"
            @keyup.enter="createProjectUnlessDisabled()"
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
    updateProjectName(name: string) {
        return name;
    }

    createProjectUnlessDisabled() {
        if (!this.disabled) {
            this.createProject();
        }
    }
}
</script>

<style scoped lang="scss">
.create-project {
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    .project-name {
        flex-basis: 250px;
    }

    button {
        &.disabled {
            cursor: not-allowed;
        }
    }
}
</style>
