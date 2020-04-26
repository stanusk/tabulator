<template>
    <div>
        <q-btn
            :icon="isSelected ? 'check_box' : 'check_box_outline_blank'"
            @click.stop="toggleSelected(tab, isSelected, $event)"
            color="primary"
            size="sm"
            round
            flat
        >
            <q-tooltip :delay="500">
                Add tab to project
            </q-tooltip>
        </q-btn>

        <q-btn
            @click.stop="closeTab(tab.id)"
            icon="delete_forever"
            color="negative"
            size="sm"
            round
            flat
        >
            <q-tooltip :delay="500">
                Close tab
            </q-tooltip>
        </q-btn>
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

<style scoped lang="scss"></style>
