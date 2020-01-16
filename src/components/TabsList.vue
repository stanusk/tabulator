<template>
    <b-list-group>
        <b-list-group-item
            button
            v-for="tab of tabs"
            v-bind:key="tab.id"
            :active="tab.active"
            @click="highlight(tab.id)"
            class="d-flex justify-content-between align-items-center"
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
                @click="closeTab(tab.id)"
                class="h3"
            >
            </b-icon>
        </b-list-group-item>
    </b-list-group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tab = browser.tabs.Tab;

@Component
export default class TabsList extends Vue {
    tabs: Tab[] = [];
    selectedTabs: Tab[] = [];

    mounted() {
        browser.tabs.query({}).then((tabs: Tab[]) => {
            this.tabs = tabs;
        });
    }

    highlight(tabId: number) {
        browser.tabs.update(tabId, { active: true });
    }

    isSelected(tab: Tab) {
        return this.selectedTabs.includes(tab);
    }

    toggleSelected(tab: Tab) {
        const addTab = (addedTab: Tab) => {
            return [...this.selectedTabs, addedTab];
        };

        const removeTab = (removedTab: Tab) => {
            return this.selectedTabs.filter(t => t.id !== removedTab.id);
        };

        this.selectedTabs = this.isSelected(tab) ? removeTab(tab) : addTab(tab);
    }

    closeTab(tabId: number) {
        browser.tabs.remove(tabId).then(_ => {
            this.tabs = this.tabs.filter(tab => tab.id !== tabId);
        });
    }

    // get defaultText() {
    //   return browser.i18n.getMessage("extName");
    // }
}
</script>

<style scoped>
.tab-title-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}
</style>
