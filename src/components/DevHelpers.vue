<template>
    <q-btn-group class="buttons">
        <q-btn color="negative" @click="clear">Clear storage</q-btn>
        <q-btn color="dark" @click="logSize">Log storage size</q-btn>
    </q-btn-group>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { logStorageSize, clearStorage } from '@/store/helpers/helpers';

@Component
export default class DevHelpers extends Vue {
    clear() {
        clearStorage();
    }
    logSize() {
        logStorageSize();
    }
}
</script>

<style scoped>
.buttons {
    margin: 10px auto;
}
</style>
