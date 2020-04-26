<template>
    <div class="create-project">
        <q-input
            class="project-name"
            :value="projectName"
            :autofocus="true"
            @input="updateProjectName($event)"
            @keyup.enter="createProjectUnlessDisabled()"
            placeholder="Project name"
            dense
            outlined
        />
        <q-btn
            @click="createProject()"
            :disabled="disabled"
            color="primary"
            icon="archive"
        >
            <q-tooltip :delay="500">
                Archive selected tabs as a project
            </q-tooltip>
        </q-btn>
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
