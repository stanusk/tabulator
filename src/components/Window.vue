<template>
    <q-list class="window" bordered>
        <tab-component
            v-for="tab of bWindow.tabs"
            v-bind:key="tab.id"
            :tab="tab"
            :is-selected="isSelectedTab(tab.id)"
            :is-active="tab.active"
            @activate-tab="activateTab(tab.id)"
        >
            <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope" />
            </template>
        </tab-component>

        <q-item v-if="hiddenTabsCount > 0" class="tab">
            (+{{ hiddenTabsCount }} tabs)
        </q-item>
    </q-list>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { SelectedResult, WindowClean } from '@/typings';
import { isSearchedOpenTabResult } from '@/store/helpers/helpers';
import TabComponent from '@/components/Tab.vue';

@Component({
    components: {
        TabComponent,
    },
})
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
}
</style>
