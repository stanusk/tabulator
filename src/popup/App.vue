<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Quick action</router-link> |
            <router-link to="/tabs">Tabs</router-link> |
            <router-link to="/projects">Projects</router-link>
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DOWNLOAD_PROJECTS, LOAD_WINDOWS } from '@/store/action-types';

@Component
export default class App extends Vue {
    created(): void {
        this.$store.dispatch(LOAD_WINDOWS);
        this.$store.dispatch(DOWNLOAD_PROJECTS);
    }
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 350px;
    padding: 15px;
}

#nav {
    margin-bottom: 20px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
