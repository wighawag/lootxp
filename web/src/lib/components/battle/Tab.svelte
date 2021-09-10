<script lang="ts">
  export let selected: boolean;
  export let href: string;
  export let title: string;
</script>

{#if selected}
<a {href} class="text-gray-50 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-black py-4 px-4 text-sm font-medium text-center hover:bg-gray-500 focus:z-10" aria-current="page">
  <span>{title}</span>
  <span aria-hidden="true" class="bg-red-500 absolute inset-x-0 bottom-0 h-0.5"></span>
</a>
{:else}
<a {href} class="text-gray-50 hover:text-gray-50 group relative min-w-0 flex-1 overflow-hidden bg-black py-4 px-4 text-sm font-medium text-center hover:bg-gray-500 focus:z-10">
  <span>{title}</span>
  <span aria-hidden="true" class="bg-transparent absolute inset-x-0 bottom-0 h-0.5"></span>
</a>
{/if}
