<script lang="ts">
	import type { Prayer } from "$lib/dto/dto";
	import { onMount } from "svelte";
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
	let adhanPlaying = false;
	let notificationPermissionGranted = false;
	let notificationsEnabled = true;
	let notificationTime = 15; // minutes before prayer
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
	// Check notification permission
	async function checkNotificationPermission() {
		try {
			notificationPermissionGranted = await isPermissionGranted();

			if (!notificationPermissionGranted) {
				const permission = await requestPermission();
				notificationPermissionGranted = permission === "granted";
			}

			// Load notification settings from localStorage
			const savedNotificationsEnabled = localStorage.getItem(
				"notificationsEnabled",
			);
			if (savedNotificationsEnabled !== null) {
				notificationsEnabled = savedNotificationsEnabled === "true";
			}

			const savedNotificationTime =
				localStorage.getItem("notificationTime");
			if (savedNotificationTime !== null) {
				notificationTime = parseInt(savedNotificationTime);
			}
		} catch (error) {
			console.error("Error checking notification permission:", error);
			notificationPermissionGranted = false;
		}
	}
	onMount(async () => {
		await locationSection.getUserLocation();
		await solahSection.fetchPrayerTimes();
		clockInterval = setInterval(async () => {
			await getCurrentAndNextPrayer();
		}, 2000);
		// Check notification permissions
		await checkNotificationPermission();
	});
</script>

<div class=" bg-green-200 dark:bg-gray-950 h-svh w-svw">
	<div class="bg-transparent h-full p-2">
		<!-- Title and Live Time -->
		<div
			class="grid grid-cols-2 gap-2 bg-transparent max-h-2/12 min-h-2/12 py-2"
		>
			<TitleLocation
				bind:lat
				bind:long
				bind:locationLoading
				bind:this={locationSection}
			/>
			<LiveTime {hijriDate} />
		</div>
		{#if locationLoading}
			<div class=" row-span-11 max-h-11/12 min-h-11/12 h-11/12">
				<Loading {message} />
			</div>
		{:else}
			<div
				class="bg-transparent grid grid-cols-2 gap-2 row-span-5 max-h-3/12 min-h-3/12 py-2"
			>
				<CurrentNextSolah
					bind:isCurrentSolah={currentSolah}
					bind:prayer={currentPrayer}
					bind:adhanPlaying
				/>
				<CurrentNextSolah
					bind:isCurrentSolah={notCurrentSolah}
					bind:prayer={nextPrayer}
					bind:notificationsEnabled
					bind:notificationPermissionGranted
					bind:notificationTime
					bind:adhanPlaying
				/>
			</div>
			<div
				class="bg-transparent grid grid-cols-3 gap-2 row-span-3 max-h-3/12 min-h-3/12 py-2"
			>
				<SolahSection
					bind:hijriDate
					bind:lat
					bind:long
					bind:loading
					bind:prayerList
					bind:this={solahSection}
				/>
			</div>
			<div
				class="bg-transparent grid grid-cols-1 gap-2 row-span-3 max-h-4/12 min-h-4/12 py-2"
			>
				<SettingCard
					{notificationPermissionGranted}
					{notificationsEnabled}
					{notificationTime}
				/>
			</div>
		{/if}
		<!-- Current and Next Solah -->
	</div>
</div>
