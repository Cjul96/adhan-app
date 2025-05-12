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
	let prayerList: Prayer[];
	let clockInterval: number;
	let currentPrayer: Prayer;
	let nextPrayer: Prayer;
	let lat: number = 0;
	let long: number = 0;
	let hijriDate: string;
	let message: string = "Location";
	let nextPrayerIndex: number;
	async function getCurrentAndNextPrayer() {
		prayerList.forEach((prayer) => (prayer.isNext = false));
		const currentTime = new Date();
		const currentTimeStr = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
		// Find the next prayer
		nextPrayerIndex = -1;
		for (let i = 0; i < prayerList.length; i++) {
			if (prayerList[i].time > currentTimeStr) {
				nextPrayerIndex = i;
				break;
			}
		}
		if (nextPrayerIndex === -1) {
			currentPrayer = prayerList[5];
			nextPrayer = prayerList[0];
			nextPrayer.name = "Fajr (Tomorrow)";
			nextPrayerIndex = 0;
		} else {
			currentPrayer = prayerList[nextPrayerIndex - 1];
			nextPrayer = prayerList[nextPrayerIndex];
		}
	}
	onMount(async () => {
		await locationSection.getUserLocation();
		await solahSection.fetchPrayerTimes();
		clockInterval = setInterval(async () => {
			await getCurrentAndNextPrayer();
		}, 2000);
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
			<LiveTime {hijriDate} />
		</div>
		{#if locationLoading}
			<div class=" row-span-11">
				<Loading {message} />
			</div>
		{:else}
			<div class="bg-transparent grid grid-cols-2 gap-2 row-span-5">
				<CurrentNextSolah
					bind:isCurrentSolah={currentSolah}
					bind:prayer={currentPrayer}
				/>
				<CurrentNextSolah
					bind:isCurrentSolah={notCurrentSolah}
					bind:prayer={nextPrayer}
				/>
			</div>
			<div class="bg-transparent grid grid-cols-3 gap-2 row-span-3">
				<SolahSection
					bind:hijriDate
					bind:lat
					bind:long
					bind:loading
					bind:prayerList
					bind:this={solahSection}
				/>
			</div>
			<div class="bg-transparent grid grid-cols-1 gap-2 row-span-3">
				<div
					class=" bg-white dark:bg-green-950/30 dark:border dark:border-green-500 dark:shadow-md dark:shadow-green-500 rounded-lg border"
				>
					Setting
				</div>
			</div>
		{/if}
		<!-- Current and Next Solah -->
	</div>
</div>
