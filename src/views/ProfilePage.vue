<script setup lang="ts"></script>

<template>
  <main>
    <section class="max-w-7xl mx-auto">
      <div class="h-[250px] bg-green-400"></div>

      <div class="flex items-start relative py-4 px-4 sm:h-[100px] h-[75px]">
        <div
          class="top-0 -translate-y-[calc(50%+16px)] sm:h-[200px] sm:w-[200px] h-[150px] w-[150px] shrink-0 rounded-full border-4 border-white bg-gray-200"
        />

        <div class="ml-auto">
          <button class="bg-white border-2 py-2 px-4 rounded-lg">Edit profile</button>
        </div>
      </div>
      <div class="space-y-2 px-4 py-4">
        <div>
          <p class="text-2xl font-bold sm:text-start">Name</p>
          <p class="font-bold sm:text-start">@Username</p>
        </div>
        <p class="sm:text-start">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, tenetur!
        </p>
        <p>follower: 0 following: 0</p>
      </div>
      <div class="flex items-center bg-gray-100">
        <button class="py-4 w-full text-center hover:bg-gray-200">Feed</button>
        <button class="py-4 w-full text-center hover:bg-gray-200">Your articles</button>
        <button class="py-4 w-full text-center hover:bg-gray-200">Favorited articles</button>
      </div>
    </section>
  </main>
</template>
