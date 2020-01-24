<template>
    <b-container class="d-flex justify-content-around">
        <b-button variant="danger" @click="clear">Clear</b-button>
        <b-button variant="info" @click="logSize">Log storage size</b-button>
    </b-container>
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

<style scoped></style>
