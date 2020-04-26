<template>
    <div class="tab-title-buttons">
        <b-icon
            :icon="isSelected ? 'star-fill' : 'star'"
            variant="primary"
            @click.stop="toggleSelected(tab, isSelected, $event)"
            class="h3 m-0"
        >
        </b-icon>

        <b-icon
            icon="x"
            variant="danger"
            @click.stop="closeTab(tab.id)"
            class="h3 m-0"
        >
        </b-icon>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { TabClean } from '@/typings';
import { pick } from 'lodash-es';

@Component
export default class TabActionButtons extends Vue {
    @Prop()
    tab!: TabClean;

    @Prop()
    isSelected!: boolean;

    @Emit('close-tab')
    closeTab(closedTabsId: number) {
        return closedTabsId;
    }

    @Emit('toggle-selected')
    toggleSelected(tab: TabClean, isSelected: boolean, event: MouseEvent) {
        const modifiers = pick(event, [
            'ctrlKey',
            'shiftKey',
            'altKey',
            'metaKey',
        ]);
        return { tab, isSelected, modifiers };
    }
}
</script>

<style scoped lang="scss">
.tab-title-buttons {
    display: flex;
}
</style>
