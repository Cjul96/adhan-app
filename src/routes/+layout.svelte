<script lang="ts">
    export const prerender = true;
    export const ssr = false;
    let { children } = $props();
    import "../app.css";
</script>
{@render children()}
