<template>
    <q-list class="window" bordered>
        <q-item
            clickable
            v-ripple
            v-for="tab of bWindow.tabs"
            v-bind:key="tab.id"
            @click="activateTab(tab.id)"
            class="tab"
            :class="{
                active: isSelectedTab(tab.id),
                highlight: tab.active,
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
                <slot
                    name="tabActions"
                    v-bind:tab="tab"
                    class="tab-actions"
                ></slot>
            </q-item-section>
        </q-item>

        <q-item v-if="hiddenTabsCount > 0" class="tab">
            (+{{ hiddenTabsCount }} tabs)
        </q-item>
    </q-list>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { SelectedResult, WindowClean } from '@/typings';
import { isSearchedOpenTabResult } from '@/store/helpers/helpers';

@Component
export default class WindowComponent extends Vue {
    @Prop()
    bWindow!: WindowClean;

    @Prop({ default: null })
    selectedResult!: SelectedResult;

    @Prop({ default: 0 })
    hiddenTabsCount!: number;

    @Emit('activate-tab')
    activateTab(tabId: number) {
        return { tabId, windowId: this.bWindow.id };
    }

    isSelectedTab(tabId: number) {
        if (
            !this.selectedResult ||
            !isSearchedOpenTabResult(this.selectedResult)
        ) {
            return false;
        }

        return (
            this.selectedResult.windowId === this.bWindow.id &&
            this.selectedResult.tabId === tabId
        );
    }
}
</script>

<style scoped lang="scss">
.window {
    margin-top: 5px;

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
}
</style>
