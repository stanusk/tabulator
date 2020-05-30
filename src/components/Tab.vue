<template>
    <q-item
        clickable
        v-ripple
        @click="activateTab"
        class="tab"
        :active="isSelected"
        :class="{
            highlight: isActive,
        }"
    >
        <q-item-section>
            <q-item-label class="tab-title-text">
                {{ tab.title }}
            </q-item-label>

            <q-tooltip :delay="500">
                <p>{{ tab.title }}</p>
                <p>{{ tab.url }}</p>
            </q-tooltip>
        </q-item-section>

        <q-item-section side>
            <slot name="tabActions" v-bind:tab="tab" class="tab-actions"></slot>
        </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { TabClean } from '@/typings';

@Component
export default class TabComponent extends Vue {
    @Prop()
    tab!: TabClean;

    @Prop({ default: false })
    isSelected!: boolean;

    @Prop({ default: false })
    isActive!: boolean;

    @Emit('activate-tab')
    activateTab() {
        return;
    }
}
</script>

<style scoped lang="scss">
.tab {
    &.highlight:not(.active) {
        background-color: azure;
    }

    .tab-title-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }
}
</style>
