<template>
    <b-list-group>
        <b-list-group-item
            button
            v-for="(title, i) of tabTitles"
            v-bind:key="i"
        >
            {{ title }}
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
p {
    font-size: 20px;
}
</style>
