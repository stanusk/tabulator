<template>
    <b-list-group flush>
        <b-list-group-item
            button
            v-for="tab of tabs"
            v-bind:key="tab.id"
            @click="activateTab(tab.id)"
            class="tab d-flex justify-content-between align-items-center p-2"
            :class="{ highlight: tab.active }"
        >
            <span class="tab-title-text">
                {{ tab.title }}
            </span>

            <b-icon
                v-if="isSelected(tab)"
                icon="star-fill"
                @click.stop="toggleSelected(tab)"
                class="h3"
            >
            </b-icon>
            <b-icon
                v-else
                icon="star"
                @click.stop="toggleSelected(tab)"
                class="h3"
            >
            </b-icon>

            <b-icon
                icon="x-square-fill"
                variant="dark"
                @click.stop="closeTab(tab.id)"
                class="h3"
            >
            </b-icon>
        </b-list-group-item>
    </b-list-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Tab = browser.tabs.Tab;

@Component
export default class TabsList extends Vue {
    @Prop({ default: () => [] })
    tabs!: Tab[];

    @Prop({ default: () => [] })
    selectedTabs!: Tab[];

    activateTab(tabId: number) {
        this.$emit('activate-tab', tabId);
    }

    isSelected(tab: Tab) {
        return this.selectedTabs.includes(tab);
    }

    toggleSelected(tab: Tab) {
        this.$emit('toggle-selected-tab', tab);
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
        max-width: 200px;
    }
}
</style>
