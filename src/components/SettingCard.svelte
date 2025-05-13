<script lang="ts">
    export let notificationPermissionGranted: boolean;
    export let notificationsEnabled: boolean;
    export let notificationTime: number; // minutes before prayer
    function toggleNotifications() {
        notificationsEnabled = !notificationsEnabled;
        localStorage.setItem(
            "notificationsEnabled",
            String(notificationsEnabled),
        );
    }
    // Update notification time
    function handleNotificationTimeChange() {
        localStorage.setItem("notificationTime", String(notificationTime));
    }
</script>

<div
    class=" bg-white dark:bg-green-950/30 dark:border dark:border-green-500 dark:shadow-md dark:shadow-green-500 rounded-lg border p-4"
>
    <h2
        class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center"
    >
        <svg
            class="w-6 h-6 mr-2 text-amber-600 dark:text-amber-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
            />
        </svg>
        Settings
    </h2>
    <div class=" grid grid-cols-1 gap-2">
        <div>
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Prayer Time Notifications
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications before prayer times
                    </p>
                </div>
                <button
                    class="relative inline-flex items-center h-6 rounded-full w-11 {notificationsEnabled
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'} transition-colors focus:outline-none"
                    on:click={toggleNotifications}
                    disabled={!notificationPermissionGranted}
                    title={!notificationPermissionGranted
                        ? "Notification permission denied"
                        : ""}
                >
                    <span class="sr-only">Enable notifications</span>
                    <span
                        class="absolute h-5 w-5 rounded-full bg-white shadow transform transition-transform {notificationsEnabled
                            ? 'translate-x-5'
                            : 'translate-x-1'}"
                    ></span>
                </button>
            </div>

            {#if notificationsEnabled}
                <div class="space-y-2">
                    <label
                        for="notificationTime"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Notification Time (minutes before prayer)
                        {notificationTime}
                    </label>
                    <select
                        id="notificationTime"
                        bind:value={notificationTime}
                        on:change={handleNotificationTimeChange}
                        class="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="20">20 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="50">50 minutes</option>
                    </select>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Get notified before prayer time
                    </p>
                </div>
            {/if}

            {#if !notificationPermissionGranted}
                <div
                    class="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400"
                >
                    <p class="text-sm">
                        Notification permissions are required. Please enable
                        them in your browser or system settings.
                    </p>
                </div>
            {/if}
        </div>
        <div></div>
    </div>
</div>
