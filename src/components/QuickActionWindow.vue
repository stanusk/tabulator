<template>
    <b-card class="filtered-window">
        <b-list-group flush>
            <b-list-group-item
                button
                v-for="tab of bWindow.tabs"
                v-bind:key="tab.id"
                @click="activateTab(tab.id)"
                class="tab p-2"
                :class="{
                    active: isSelectedTab(tab.id),
                }"
            >
                {{ tab.title }}
            </b-list-group-item>

            <b-list-group-item v-if="hiddenTabsCount > 0" class="tab p-2">
                (+{{ hiddenTabsCount }} tabs)
            </b-list-group-item>
        </b-list-group>
    </b-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import {
    SearchedOpenTabResult,
    SearchedProjectResult,
    WindowClean,
} from '@/typings';
import { isSearchedOpenTabResult } from '@/store/helpers/helpers';

// TODO: move to separate typings file also from Project.vue
type SelectedResult = null | SearchedProjectResult | SearchedOpenTabResult;

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
.filtered-window {
    margin-top: 5px;
    border: 2px solid rgba(0, 0, 0, 0.225);
    .card-body {
        padding: 0;
    }
    .tab {
        font-size: 0.9rem;
        text-align: left;
    }

    &.filtered-window {
        border-color: rebeccapurple;
    }
}
</style>
