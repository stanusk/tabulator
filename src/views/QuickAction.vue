<template>
    <div class="quick-action">
        <b-form-input
            class="search-input"
            placeholder="Searched project or tab"
            :autofocus="true"
        >
        </b-form-input>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class QuickAction extends Vue {}
</script>

<style scoped lang="scss">
.quick-action {
    margin: 10px;
}
</style>
