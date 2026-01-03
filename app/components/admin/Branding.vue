<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center gap-2">
        <Icon name="ph:paint-brush" class="text-text-muted" />
        <h3
          class="text-xs font-bold uppercase tracking-wider text-text-primary"
        >
          Site Branding
        </h3>
      </div>
    </div>
    <div class="card-body space-y-6">
      <!-- Preview -->
      <div class="p-4 bg-bg-tertiary rounded-lg border border-border">
        <p class="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
          Preview
        </p>
        <div class="flex items-center gap-2.5">
          <div
            class="w-7 h-7 bg-white rounded-sm flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="useCustomImage && siteLogoImage"
              :src="siteLogoImage"
              alt="Logo"
              class="w-full h-full object-contain"
            />
            <Icon v-else :name="siteLogo" class="text-black text-lg" />
          </div>
          <div class="flex flex-col leading-none">
            <span class="text-sm font-bold tracking-tighter uppercase">{{
              siteName || 'OpenTracker'
            }}</span>
            <span class="text-[10px] text-text-muted font-mono">{{
              siteSubtitle || `v${useRuntimeConfig().public.appVersion}`
            }}</span>
          </div>
        </div>
      </div>

      <!-- Site Name -->
      <div>
        <label
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2"
        >
          Site Name
        </label>
        <input
          v-model="siteName"
          type="text"
          maxlength="50"
          class="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-white/20"
          placeholder="OpenTracker"
        />
        <p class="text-[10px] text-text-muted mt-1.5">
          Displayed in the navbar and browser title.
        </p>
      </div>

      <!-- Site Subtitle -->
      <div>
        <label
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2"
        >
          Subtitle
        </label>
        <input
          v-model="siteSubtitle"
          type="text"
          maxlength="100"
          class="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-white/20 font-mono"
          placeholder="Leave empty for version number"
        />
        <p class="text-[10px] text-text-muted mt-1.5">
          Text below site name. Leave empty to show version.
        </p>
      </div>

      <!-- Logo Type Toggle -->
      <div>
        <label
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2"
        >
          Logo Type
        </label>
        <div class="flex gap-2">
          <button
            @click="useCustomImage = false"
            class="flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded border transition-colors"
            :class="!useCustomImage ? 'bg-white text-black border-white' : 'bg-bg-tertiary border-border text-text-secondary hover:border-white/20'"
          >
            <Icon name="ph:phosphor-logo" class="mr-1" /> Icon
          </button>
          <button
            @click="useCustomImage = true"
            class="flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded border transition-colors"
            :class="useCustomImage ? 'bg-white text-black border-white' : 'bg-bg-tertiary border-border text-text-secondary hover:border-white/20'"
          >
            <Icon name="ph:image" class="mr-1" /> Image
          </button>
        </div>
      </div>

      <!-- Icon Selection (when useCustomImage is false) -->
      <div v-if="!useCustomImage">
        <label
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2"
        >
          Logo Icon
        </label>
        <div class="flex gap-2">
          <input
            v-model="siteLogo"
            type="text"
            maxlength="100"
            class="flex-1 bg-bg-tertiary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-white/20 font-mono"
            placeholder="ph:broadcast-bold"
          />
          <div
            class="w-10 h-10 bg-bg-tertiary border border-border rounded flex items-center justify-center"
          >
            <Icon :name="siteLogo" class="text-xl text-text-secondary" />
          </div>
        </div>
        <p class="text-[10px] text-text-muted mt-1.5">
          Use Phosphor icon names (e.g., ph:broadcast-bold, ph:globe, ph:rocket).
        </p>

        <!-- Common Icons -->
        <div class="mt-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
            Quick Select
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="icon in commonIcons"
              :key="icon"
              @click="siteLogo = icon"
              class="w-9 h-9 bg-bg-tertiary border rounded flex items-center justify-center hover:bg-white/5 transition-colors"
              :class="siteLogo === icon ? 'border-white' : 'border-border'"
            >
              <Icon :name="icon" class="text-lg text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      <!-- Image Upload (when useCustomImage is true) -->
      <div v-if="useCustomImage">
        <label
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-2"
        >
          Logo Image
        </label>
        
        <!-- Current Image Preview -->
        <div v-if="siteLogoImage" class="mb-3 flex items-center gap-3">
          <div class="w-12 h-12 bg-white rounded flex items-center justify-center overflow-hidden">
            <img :src="siteLogoImage" alt="Current logo" class="max-w-full max-h-full object-contain" />
          </div>
          <button
            @click="removeImage"
            class="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <Icon name="ph:trash" class="mr-1" /> Remove
          </button>
        </div>

        <!-- Upload Input -->
        <div
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          class="border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer"
          :class="dragOver ? 'border-white bg-white/5' : 'border-border hover:border-white/30'"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            class="hidden"
            @change="handleFileSelect"
          />
          <Icon name="ph:upload-simple" class="text-2xl text-text-muted mb-2" />
          <p class="text-xs text-text-muted">
            {{ uploading ? 'Uploading...' : 'Drop image or click to upload' }}
          </p>
          <p class="text-[10px] text-text-muted/60 mt-1">
            PNG, JPG, SVG, WebP (max 2MB)
          </p>
        </div>
      </div>

      <!-- Save Button -->
      <button
        @click="saveBranding"
        :disabled="loading"
        class="w-full bg-text-primary text-bg-primary text-[10px] font-bold uppercase tracking-widest py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Icon v-if="loading" name="ph:circle-notch" class="animate-spin" />
        {{ loading ? 'Saving...' : 'Save Branding' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const siteName = ref('OpenTracker');
const siteLogo = ref('ph:broadcast-bold');
const siteLogoImage = ref<string | null>(null);
const siteSubtitle = ref<string | null>(null);
const useCustomImage = ref(false);
const loading = ref(false);
const uploading = ref(false);
const dragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const commonIcons = [
  'ph:broadcast-bold',
  'ph:globe',
  'ph:rocket',
  'ph:lightning',
  'ph:fire',
  'ph:star',
  'ph:planet',
  'ph:atom',
  'ph:cube',
  'ph:diamond',
  'ph:crown',
  'ph:shield-check',
];

onMounted(async () => {
  try {
    const settings = await $fetch<{
      siteName: string;
      siteLogo: string;
      siteLogoImage: string | null;
      siteSubtitle: string | null;
    }>('/api/admin/settings');
    siteName.value = settings.siteName;
    siteLogo.value = settings.siteLogo;
    siteLogoImage.value = settings.siteLogoImage;
    siteSubtitle.value = settings.siteSubtitle;
    useCustomImage.value = !!settings.siteLogoImage;
  } catch (error) {
    console.error('Failed to load branding settings:', error);
  }
});

function triggerFileInput() {
  fileInput.value?.click();
}

function handleDrop(e: DragEvent) {
  dragOver.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) uploadFile(file);
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) uploadFile(file);
  input.value = '';
}

async function uploadFile(file: File) {
  if (uploading.value) return;
  
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('logo', file);
    
    const result = await $fetch<{ url: string }>('/api/admin/logo', {
      method: 'POST',
      body: formData,
    });
    
    siteLogoImage.value = result.url;
  } catch (error) {
    console.error('Failed to upload logo:', error);
  } finally {
    uploading.value = false;
  }
}

function removeImage() {
  siteLogoImage.value = null;
}

async function saveBranding() {
  loading.value = true;
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: {
        siteName: siteName.value,
        siteLogo: siteLogo.value,
        siteLogoImage: useCustomImage.value ? siteLogoImage.value : null,
        siteSubtitle: siteSubtitle.value || null,
      },
    });
  } catch (error) {
    console.error('Failed to save branding:', error);
  } finally {
    loading.value = false;
  }
}
</script>

