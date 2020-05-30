<template>
    <q-input
        class="quick-action-input"
        :autofocus="true"
        :value="qInput"
        @input="inputUpdate($event)"
        @keydown.enter.prevent.stop="executeAction"
        @keydown.down.prevent.stop="selectNextResult"
        @keydown.up.prevent.stop="selectPreviousResult"
        placeholder="Searched project or tab"
        debounce="500"
        dense
        outlined
    />
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component
export default class QuickActionInput extends Vue {
    @Prop({ default: '' })
    qInput!: string;

    @Emit('update-quick-action-input')
    inputUpdate(qInput: string) {
        return qInput;
    }

    @Emit('execute-quick-action')
    executeAction() {}

    @Emit('select-next-result')
    selectNextResult() {}

    @Emit('select-previous-result')
    selectPreviousResult() {}
}
</script>

<style scoped></style>
