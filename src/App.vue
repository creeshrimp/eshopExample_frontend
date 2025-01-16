<template>
    <v-app>
        <!-- 有動態路由參數時：例如 /user/:id，當 id 改變時，沒有 key 的情況下，Vue 可能會重用舊的組件。 -->
        <!-- https://chatgpt.com/share/678722b8-56c0-8011-aca5-4d443faa6c83 -->
        <router-view :key="$route.fullPath" />
    </v-app>
</template>
