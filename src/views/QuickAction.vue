<template>
    <div class="quick-action">
        <b-form-input
            class="search-input"
            placeholder="Searched project or tab"
            v-model="searchInput"
            debounce="500"
            :autofocus="true"
        >
        </b-form-input>

        <b-card v-for="bWindow in filteredWindows" v-bind:key="bWindow.id">
            <b-list-group flush>
                <b-list-group-item
                    button
                    v-for="tab of bWindow.tabs"
                    v-bind:key="tab.id"
                    @click="activateTab(tab.id, bWindow.id)"
                    class="tab p-2"
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

    get filteredWindows(): WindowClean[] {
        if (this.searchInput === '') {
            return [];
        }

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
