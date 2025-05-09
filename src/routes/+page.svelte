<script lang="ts">
	import type { Prayer } from "$lib/dto/dto";
	import { onMount } from "svelte";
	import CurrentNextSolah from "../components/CurrentNextSolah.svelte";
	import LiveTime from "../components/LiveTime.svelte";
	import Loading from "../components/Loading.svelte";
	import SolahSection from "../components/SolahSection.svelte";
	import TitleLocation from "../components/TitleLocation.svelte";

	let loading: boolean = true;
	let currentSolah: boolean = true;
	let notCurrentSolah: boolean = false;
	let locationLoading: boolean = true;
	let locationSection: TitleLocation;
	let solahSection: SolahSection;
	let lat: number = 0;
	let long: number = 0;

	onMount(async () => {
		await locationSection.getUserLocation();
		await solahSection.fetchPrayerTimes();
	});
</script>

<div class=" bg-green-200 dark:bg-gray-950 h-svh w-svw">
	<div class=" bg-transparent grid grid-cols-1 gap-2 h-full p-2">
		<!-- Title and Live Time -->
		<div class="grid grid-cols-2 gap-2 bg-transparent">
			<TitleLocation
				bind:lat
				bind:long
				bind:locationLoading
				bind:this={locationSection}
			/>
			<LiveTime />
		</div>
		{#if locationLoading}
			<div class=" row-span-11">
				<Loading />
			</div>
		{:else}
			<div class="bg-transparent grid grid-cols-2 gap-2 row-span-5">
				<CurrentNextSolah bind:isCurrentSolah={currentSolah} />
				<CurrentNextSolah bind:isCurrentSolah={notCurrentSolah} />
			</div>
			<div class="bg-transparent grid grid-cols-3 gap-2 row-span-3">
				<SolahSection
					bind:lat
					bind:long
					bind:loading
					bind:this={solahSection}
				/>
			</div>
			<div class="bg-transparent grid grid-cols-1 gap-2 row-span-3">
				<div
					class=" bg-white dark:bg-green-950/30 dark:border dark:border-green-500 dark:shadow-md dark:shadow-green-500 rounded-lg border"
				>
					test
				</div>
			</div>
		{/if}
		<!-- Current and Next Solah -->
	</div>
</div>
