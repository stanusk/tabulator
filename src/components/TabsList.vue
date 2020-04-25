<!-- todo: remove TabsList component-->
<template>
    <b-list-group flush>
        <b-list-group-item
            button
            v-for="tab of tabs"
            v-bind:key="tab.id"
            @click="toggleSelected(tab, isSelected(tab), $event)"
            class="tab p-2"
            :class="{ highlight: tab.active }"
        >
            <span
                @click="activateTab(tab.id, tab.windowId)"
                class="tab-title-text"
            >
                {{ tab.title }}
            </span>

            <div class="tab-title-buttons">
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
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { TabClean } from '@/typings';
import { pick } from 'lodash-es';

@Component
export default class TabsList extends Vue {
    @Prop({ default: () => [] })
    tabs!: TabClean[];

    @Prop({ default: () => [] })
    selectedTabs!: TabClean[];

    @Emit('activate-tab')
    activateTab(tabId: number, windowId: number) {
        return { tabId, windowId };
    }

    @Emit('toggle-selected-tab')
    toggleSelected(tab: TabClean, isSelected: boolean, event: MouseEvent) {
        const modifiers = pick(event, [
            'ctrlKey',
            'shiftKey',
            'altKey',
            'metaKey',
        ]);
        return { tab, isSelected, modifiers };
    }

    @Emit('close-tab')
    closeTab(tabId: number) {
        return [tabId];
    }

    isSelected(tab: TabClean) {
        return this.selectedTabs.find(t => t.id === tab.id) !== undefined;
    }

    // get defaultText() {
    //   return browser.i18n.getMessage("extName");
    // }
}
</script>

<style scoped lang="scss">
.tab {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.highlight {
        background-color: azure;
    }

    .tab-title-text {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;

        &:hover {
            text-decoration: underline;
        }
    }

    .tab-title-buttons {
        display: flex;
    }
}
</style>
