<template>
    <div class="quick-action">
        <b-form-input
            class="search-input"
            placeholder="Searched project or tab"
            v-model="searchInput"
            debounce="500"
            :autofocus="true"
            @keydown="onKeydown($event)"
        >
        </b-form-input>

        <b-card
            v-for="(bWindow, windowIndex) in filteredWindows"
            v-bind:key="bWindow.id"
        >
            <b-list-group flush>
                <b-list-group-item
                    button
                    v-for="(tab, tabIndex) of bWindow.tabs"
                    v-bind:key="tab.id"
                    @click="activateTab(tab.id, bWindow.id)"
                    class="tab p-2"
                    :class="{
                        active:
                            tabIndex === selectedTabIndex &&
                            windowIndex === selectedWindowIndex,
                    }"
                >
                    {{ tab.title }}
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { WINDOWS } from '@/store/getter-types';
import { TabClean, WindowClean } from '@/typings';
import TabsList from '@/components/TabsList.vue';
import { ACTIVATE_TAB } from '@/store/action-types';

@Component({
    components: {
        TabsList,
    },
})
export default class QuickAction extends Vue {
    @Getter(WINDOWS)
    bWindows!: WindowClean[];

    searchInput: string = '';
    selectedTabIndex: number = 0;
    selectedWindowIndex: number = 0;

    get filteredWindows(): WindowClean[] {
        if (this.searchInput === '') {
            return [];
        }

        this.selectedTabIndex = 0;
        this.selectedWindowIndex = 0;

        return this.bWindows.reduce((filteredWindows, currentWindow) => {
            const windowWithFilteredTabs = this.filterWindow(
                currentWindow,
                this.searchInput
            );

            return windowWithFilteredTabs
                ? [...filteredWindows, windowWithFilteredTabs]
                : filteredWindows;
        }, [] as WindowClean[]);
    }

    onKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter': {
                const selectedWindow = this.filteredWindows[
                    this.selectedWindowIndex
                ];
                const selectedTab = selectedWindow.tabs[this.selectedTabIndex];
                this.activateTab(selectedTab.id, selectedWindow.id);
                break;
            }
            case 'ArrowDown': {
                event.stopPropagation();
                event.preventDefault();
                const selectedWindow = this.filteredWindows[
                    this.selectedWindowIndex
                ];
                if (selectedWindow.tabs.length > this.selectedTabIndex + 1) {
                    this.selectNextTab();
                } else if (
                    this.filteredWindows.length >
                    this.selectedWindowIndex + 1
                ) {
                    this.selectNextWindow();
                }
                break;
            }
            case 'ArrowUp': {
                event.stopPropagation();
                event.preventDefault();
                if (this.selectedTabIndex > 0) {
                    this.selectPreviousTab();
                } else if (this.selectedWindowIndex > 0) {
                    this.selectPreviousWindow();
                }
                break;
            }
        }
    }

    private selectNextTab() {
        this.selectedTabIndex++;
    }

    private selectPreviousTab() {
        this.selectedTabIndex--;
    }

    private selectNextWindow() {
        this.selectedWindowIndex++;
        this.selectedTabIndex = 0;
    }

    private selectPreviousWindow() {
        this.selectedWindowIndex--;
        const selectedWindow = this.filteredWindows[this.selectedWindowIndex];

        this.selectedTabIndex = selectedWindow.tabs.length - 1;
    }

    activateTab(tabId: number, windowId: number) {
        this.$store.dispatch(ACTIVATE_TAB, { tabId, windowId });
    }

    findTabsContainingText(text: string, tabs: TabClean[]) {
        return tabs.filter(tab => {
            return `${tab.title}${tab.url}`.indexOf(text) > -1;
        });
    }

    filterWindow(window: WindowClean, text: string): WindowClean | null {
        const windowWithFilteredTabs = {
            ...window,
            tabs: this.findTabsContainingText(text, window.tabs),
        };

        return windowWithFilteredTabs.tabs.length
            ? windowWithFilteredTabs
            : null;
    }
}
</script>

<style scoped lang="scss">
.quick-action {
    margin: 10px;
}
.card {
    margin-top: 5px;
    border: 2px solid rgba(0, 0, 0, 0.225);
    .card-body {
        padding: 0;
    }
    .tab {
        font-size: 0.9rem;
        text-align: left;
    }
}
</style>
