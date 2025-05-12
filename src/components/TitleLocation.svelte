<script lang="ts">
    import SolahSection from "./SolahSection.svelte";
    export let lat: number = 0;
    export let long: number = 0;
    export let locationLoading: boolean;
    // export let solahSection: SolahSection;

    let locationName: string = "Loading location...";
    // Get user coordinates
    export async function getUserLocation() {
        try {
            const position = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                },
            );

            const { latitude, longitude } = position.coords;
            lat = latitude;
            long = longitude;

            // Fetch location name
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                );
                const data = await response.json();
                if (data.address) {
                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.county ||
                        "";
                    const state = data.address.state || "";
                    const country = data.address.country || "";

                    if (city && country) {
                        locationName = `${city}, ${country}`;
                    } else if (state && country) {
                        locationName = `${state}, ${country}`;
                    } else {
                        locationName = country;
                    }
                }
                locationLoading = false;
                // await solahSection.fetchPrayerTimes();
            } catch (error) {
                console.error("Error fetching location name:", error);
                locationName = "Unknown location";
            }
        } catch (error) {
            console.error("Error getting user location:", error);
            locationName = "Location access denied";
        }
    }
</script>

<div class=" flex items-center justify-start">
    <div class="flex items-center">
        <img src="adhan icon.png" alt="" class=" h-10 mx-4" />
        <div class="">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Adhan App
            </h1>
            <div class="text-sm flex items-center">
                <svg
                    class="w-4 h-4 mr-1 text-gray-700 dark:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd"
                    />
                </svg>
                <span class="text-gray-700 dark:text-white">{locationName}</span
                >
            </div>
        </div>
    </div>
</div>
