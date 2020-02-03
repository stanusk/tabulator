<template>
    <b-list-group flush>
        <b-list-group-item
            button
            v-for="tab of tabs"
            v-bind:key="tab.id"
            @click="toggleSelected(tab, isSelected(tab), $event)"
            class="tab d-flex justify-content-between align-items-center p-2"
            :class="{ highlight: tab.active }"
        >
            <span
                @click="activateTab(tab.id, tab.windowId)"
                class="tab-title-text"
            >
                {{ tab.title }}
            </span>

            <div>
                <b-icon
                    :icon="isSelected(tab) ? 'star-fill' : 'star'"
                    variant="primary"
                    @click.stop="toggleSelected(tab, isSelected(tab), $event)"
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
        </b-list-group-item>
    </b-list-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TabClean } from '@/typings';
import { pick } from 'lodash-es';

@Component
export default class TabsList extends Vue {
    @Prop({ default: () => [] })
    tabs!: TabClean[];

    @Prop({ default: () => [] })
    selectedTabs!: TabClean[];

    activateTab(tabId: number, windowId: number) {
        this.$emit('activate-tab', { tabId, windowId });
    }

    isSelected(tab: TabClean) {
        return this.selectedTabs.find(t => t.id === tab.id) !== undefined;
    }

    toggleSelected(tab: TabClean, isSelected: boolean, event: MouseEvent) {
        const modifiers = pick(event, [
            'ctrlKey',
            'shiftKey',
            'altKey',
            'metaKey',
        ]);
        this.$emit('toggle-selected-tab', { tab, isSelected, modifiers });
    }

    closeTab(tabId: number) {
        this.$emit('close-tab', [tabId]);
    }

    // get defaultText() {
    //   return browser.i18n.getMessage("extName");
    // }
}
</script>

<style scoped lang="scss">
.tab {
    &.highlight {
        background-color: azure;
    }
    .tab-title-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 250px;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
