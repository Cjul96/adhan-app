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
		sendNotification,
	} from "@tauri-apps/plugin-notification";
	// parameter
	let prayerResponse: PrayerTimesResponse;
	let prayerList: Prayer[] = [];
	let hijriDate: string = "";
	let currentPrayer: Prayer;
	let nextPrayer: Prayer;
	let clockInterval: number;
	let adhanAudio: HTMLAudioElement;

	// component param
	let solahSection: SolahSection;

	// indicator
	let loading: boolean = true;
	let lat: number = 0;
	let long: number = 0;
	let selectedMethod = "3";
	let locationName: string = "Loading location...";
	let adhanPlaying = false;
	let notificationsEnabled = true;
	let notificationPermissionGranted = false;
	let countdownText = "";
	let notificationTime = 15;

	async function getCurrentAndNextPrayer() {
		prayerList.forEach((prayer) => (prayer.isNext = false));
		const currentTime = new Date();
		const currentTimeStr = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
		// Find the next prayer
		let nextPrayerIndex = -1;
		prayerList.forEach((pray) => {
			pray.isNow = false;
		});
		for (let i = 0; i < prayerList.length; i++) {
			if (prayerList[i].time > currentTimeStr) {
				nextPrayerIndex = i;
				break;
			}
		}
		if (nextPrayerIndex === -1) {
			currentPrayer = prayerList[5];
			prayerList[5].isNow = true;
			nextPrayer = prayerList[0];
			nextPrayer.name = "Fajr (Tomorrow)";
			nextPrayerIndex = 0;
		} else {
			currentPrayer = prayerList[nextPrayerIndex - 1];
			prayerList[nextPrayerIndex - 1].isNow = true;
			nextPrayer = prayerList[nextPrayerIndex];
		}

		const [hours, minutes] = nextPrayer.time.split(":").map(Number);
		const prayerTime = new Date(currentTime);
		prayerTime.setDate(
			currentTime.getDate() +
				(nextPrayer.name == "Fajr (Tomorrow)" ? 1 : 0),
		);
		prayerTime.setHours(hours, minutes, 0, 0);
		const now = new Date();
		const diffMs = prayerTime.getTime() - now.getTime();

		// Calculate hours, minutes, seconds
		const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
		// console.log("hrs:" + diffHrs + " min:" + diffMins + " sec:" + diffSecs);
		// Format countdown
		countdownText = `${String(diffHrs).padStart(2, "0")}:${String(diffMins).padStart(2, "0")}:${String(diffSecs).padStart(2, "0")}`;
		const totalMinutes = diffHrs * 60 + diffMins;
		// Notification at exact notification time
		if (totalMinutes === notificationTime && diffSecs === 0) {
			sendPrayerNotification(nextPrayer.name, notificationTime);
			// Don't mark as notified yet - we'll have another notification at prayer time
		}

		// Notification at prayer time
		if (totalMinutes === 0 && diffSecs === 0) {
			sendPrayerNotification(nextPrayer.name, 0);
			nextPrayer.notified = true;
		}
	}
	// Play Adhan
	function toggleAdhan() {
		if (adhanPlaying) {
			adhanAudio.pause();
			adhanAudio.currentTime = 0;
			adhanPlaying = false;
		} else {
			adhanAudio.play();
			adhanPlaying = true;
		}
	}
	// Send prayer notification
	async function sendPrayerNotification(
		prayerName: string,
		minutesRemaining: number,
	) {
		try {
			if (!notificationsEnabled || !notificationPermissionGranted) return;

			const message =
				minutesRemaining > 0
					? `${prayerName} prayer will be in ${minutesRemaining} minutes.`
					: `It's time for ${prayerName} prayer.`;

			// Using the plugin-notification import
			await sendNotification({
				title: `Prayer Time: ${prayerName}`,
				body: message,
				icon: "public/icon.png", // Update this path as needed
			});

			// Play adhan audio
			if (!adhanPlaying && minutesRemaining == 0) toggleAdhan();
		} catch (error) {
			console.error("Error sending notification:", error);
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
		await solahSection.getUserLocation();
		clockInterval = setInterval(async () => {
			await getCurrentAndNextPrayer();
		}, 1000);

		// Initialize audio
		adhanAudio = new Audio("/audio/adhan.mp3");
		adhanAudio.addEventListener("ended", () => {
			adhanPlaying = false;
		});
		// Check notification permissions
		await checkNotificationPermission();
	});
</script>

<div class=" bg-gray-950 h-svh w-svw">
	<div
		class="w-full h-full bg-cover bg-no-repeat bg-bottom"
		style="background-image: url('{currentPrayer == undefined
			? ''
			: currentPrayer.img}');"
	>
		{#if adhanPlaying}
			<div
				class="fixed w-full h-full bg-green-950/30 justify-center items-center flex z-50"
			>
				<div
					class="w-10/12 h-10/12 bg-green-950/90 border border-green-500 shadow-md rounded-lg justify-center items-center flex relative"
				>
					<dotlottie-player
						src="https://lottie.host/c0f8e653-1868-4b26-82f5-e5c15c7a189d/E04yQJyDKp.lottie"
						background="transparent"
						speed="1"
						class="w-1/2"
						loop
						autoplay
					></dotlottie-player>
					<button
						class="absolute bottom-8 p-3 border rounded-2xl border-green-500 text-green-500 cursor-pointer"
						onclick={toggleAdhan}
					>
						Stop Adhan
					</button>
				</div>
			</div>
		{/if}
		<div class=" fixed top-1/6 justify-center w-full text-white flex">
			<LiveTime {hijriDate} {nextPrayer} />
		</div>
		<div class=" fixed top-1/2 justify-center w-full text-white flex">
			<div class="text-5xl text-center">
				حَيَّ عَلَىٰ ٱلصَّلَاةِ <br />
				{currentPrayer == undefined ? "" : currentPrayer.name}
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
