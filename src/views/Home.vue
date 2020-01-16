<template>
    <div>
        <TabsList />
    </div>
</template>

<script>
// @ is an alias to /src
import TabsList from '@/components/TabsList.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        TabsList: TabsList,
    },
})
export default class Home extends Vue {}
</script>
