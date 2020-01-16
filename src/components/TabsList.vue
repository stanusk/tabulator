<template>
    <b-list-group>
        <b-list-group-item
            button
            v-for="(title, i) of tabTitles"
            v-bind:key="i"
            class="d-flex justify-content-between align-items-center"
        >
            <span class="tab-title-text">
                {{ title }}
            </span>
            <b-form-checkbox> </b-form-checkbox>
            <b-icon icon="x-square-fill" variant="danger"> </b-icon>
        </b-list-group-item>
    </b-list-group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tab = browser.tabs.Tab;

@Component
export default class TabsList extends Vue {
    mounted() {
        browser.tabs.query({}).then((tabs: Tab[]) => {
            this.tabTitles = tabs.map(t => t.title || 'UNKNOWN');
        });
    }

    // get defaultText() {
    //   return browser.i18n.getMessage("extName");
    // }

    tabTitles: string[] = [];
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
