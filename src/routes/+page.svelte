<script lang="ts">
	import type { Prayer, PrayerTimesResponse } from "$lib/dto/dto";
	import { onMount } from "svelte";
	import { adhan } from "$lib/services/api";
	import CurrentNextSolah from "../components/CurrentNextSolah.svelte";
	import LiveTime from "../components/LiveTime.svelte";
	import Loading from "../components/Loading.svelte";
	import SolahSection from "../components/SolahSection.svelte";
	import TitleLocation from "../components/TitleLocation.svelte";
	import SettingCard from "../components/SettingCard.svelte";
	import {
		isPermissionGranted,
		requestPermission,
	} from "@tauri-apps/plugin-notification";
	// parameter
	let prayerResponse: PrayerTimesResponse;
	let prayerList: Prayer[] = [];
	let hijriDate: string = "";
	let currentPrayer: Prayer;
	let nextPrayer: Prayer;
	let clockInterval: number;

	// component param
	let solahSection: SolahSection;

	// indicator
	let loading: boolean = true;
	let lat: number = 0;
	let long: number = 0;
	let selectedMethod = "3";
	let locationName: string = "Loading location...";

	async function getCurrentAndNextPrayer() {
		prayerList.forEach((prayer) => (prayer.isNext = false));
		const currentTime = new Date();
		const currentTimeStr = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
		// Find the next prayer
		let nextPrayerIndex = -1;
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
		await solahSection.getUserLocation();
		clockInterval = setInterval(async () => {
			await getCurrentAndNextPrayer();
		}, 1000);
	});
</script>

<div class=" bg-gray-950 h-svh w-svw">
	<div
		class="w-full h-full bg-cover bg-no-repeat bg-bottom"
		style="background-image: url('{currentPrayer == undefined
			? ''
			: currentPrayer.img}');"
	>
		<div class=" fixed top-1/6 justify-center w-full text-white flex">
			<LiveTime {hijriDate} {nextPrayer} />
		</div>
		<div class=" fixed top-1/2 justify-center w-full text-white flex">
			<div class="text-5xl text-center">
				حَيَّ عَلَىٰ ٱلصَّلَاةِ <br>
				{currentPrayer == undefined
					? ''
					: currentPrayer.name}
			</div>
		</div>
		<div
			class=" fixed bottom-4 justify-center w-full text-white flex gap-4 lg:px-90 px-30"
		>
			<SolahSection
				{lat}
				{long}
				{loading}
				bind:prayerList
				bind:hijriDate
				bind:this={solahSection}
			/>
		</div>
	</div>
</div>
