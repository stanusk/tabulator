<template>
    <b-card class="quick-action-window">
        <b-list-group flush>
            <b-list-group-item
                button
                v-for="tab of bWindow.tabs"
                v-bind:key="tab.id"
                @click="activateTab(tab.id)"
                class="tab p-2"
                :class="{
                    active: isSelectedTab(tab.id),
                    highlight: tab.active,
                }"
            >
                <span class="tab-title-text">
                    {{ tab.title }}
                </span>

                <slot
                    name="tabActions"
                    v-bind:tab="tab"
                    class="tab-actions"
                ></slot>
            </b-list-group-item>

            <b-list-group-item v-if="hiddenTabsCount > 0" class="tab p-2">
                (+{{ hiddenTabsCount }} tabs)
            </b-list-group-item>
        </b-list-group>
    </b-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { SelectedResult, WindowClean } from '@/typings';
import { isSearchedOpenTabResult } from '@/store/helpers/helpers';

@Component
export default class QuickActionWindow extends Vue {
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
.quick-action-window {
    margin-top: 5px;
    border: 2px solid rgba(0, 0, 0, 0.225);

    .card-body {
        padding: 0;
    }

    .tab {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &.highlight:not(.active) {
            background-color: azure;
        }

        .tab-title-text {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            font-size: 0.9rem;
        }
    }
}
</style>
