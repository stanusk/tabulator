<template>
    <div>
        <TabsList
            :tabs="tabs"
            :selectedTabs="selectedTabs"
            @close-tab="onCloseTab"
            @activate-tab="onActivateTab"
            @toggle-selected-tab="onToggleSelected"
        />
    </div>
</template>

<script lang="ts">
// @ is an alias to /src
import TabsList from '@/components/TabsList.vue';
import { Component, Vue } from 'vue-property-decorator';
import Tab = browser.tabs.Tab;

@Component({
    components: {
        TabsList: TabsList,
    },
})
export default class Home extends Vue {
    tabs: Tab[] = [];
    selectedTabs: Tab[] = [];

    created() {
        browser.tabs.query({}).then((tabs: Tab[]) => {
            this.tabs = tabs;
            console.log(tabs);
        });
    }

    onToggleSelected(tab: Tab) {
        const addTab = (addedTab: Tab) => {
            return [...this.selectedTabs, addedTab];
        };

        const removeTab = (removedTab: Tab) => {
            return this.selectedTabs.filter(t => t.id !== removedTab.id);
        };

        this.selectedTabs = this.selectedTabs.includes(tab)
            ? removeTab(tab)
            : addTab(tab);
    }

    onActivateTab(tabId: number) {
        browser.tabs.update(tabId, { active: true });
    }

    onCloseTab(tabId: number) {
        browser.tabs.remove(tabId).then(_ => {
            this.tabs = this.tabs.filter(tab => tab.id !== tabId);
        });
    }
}
</script>
