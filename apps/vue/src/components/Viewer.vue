<template>
  <input type="checkbox" id="explorer-toggle" v-model="explorerOpen" />

  <label
    for="explorer-toggle"
    class="xeokit-i18n explorer-toggle-label xeokit-btn fas fa-2x fa-sitemap"
    data-xeokit-i18ntip="toolbar.toggleExplorer"
    data-tippy-content="Toggle explorer"
  ></label>

  <input type="checkbox" id="inspector-toggle" v-model="inspectorOpen" />

  <label
    id="inspector-toggle-label"
    for="inspector-toggle"
    class="xeokit-i18n inspector-toggle-label xeokit-btn fas fa-info-circle fa-2x"
    data-xeokit-i18ntip="toolbar.toggleProperties"
    data-tippy-content="Toggle properties"
  ></label>

  <div id="explorer" ref="explorerElement"></div>
  <div id="toolbar" ref="toolbarElement"></div>
  <div id="inspector" ref="inspectorElement"></div>

  <select id="project-select" v-model="selectedProject">
    <option v-for="project in projects" :value="project.id" :key="project.id">
      {{ project.label }}
    </option>
  </select>

  <div id="viewer" ref="viewerElement">
    <canvas id="canvas" ref="canvasElement"></canvas>
    <canvas id="nav-cube-canvas" ref="navCubeCanvasElement"></canvas>
  </div>
</template>

<script lang="ts" setup>
import tippy from 'tippy.js';
import { onMounted, ref, watch } from 'vue';
import { BIMViewer, LocaleService, Server, messages as localeMessages } from 'xeokit-bim-viewer';

const props = defineProps({
  project: {
    type: String,
    required: false,
    default: 'OTCConferenceCenter',
  },
});

const isLoading = ref(false);
const server = ref<Server>();
const bimViewer = ref<BIMViewer>();

const explorerOpen = ref(false);
const inspectorOpen = ref(false);

const canvasElement = ref();
const explorerElement = ref();
const toolbarElement = ref();
const inspectorElement = ref();
const navCubeCanvasElement = ref();
const viewerElement = ref();

const selectedProject = ref<string>(props.project);
const projects = ref<{ id: string; label: string }[]>([]);

onMounted(() => {
  loadViewer();
});

function loadViewer() {
  server.value = new Server({
    dataDir: './',
  });

  bimViewer.value = new BIMViewer(server.value, {
    localeService: new LocaleService({
      messages: localeMessages,
      locale: 'en',
    }),
    canvasElement: canvasElement.value, // WebGL canvas
    keyboardEventsElement: document, // Optional, defaults to document
    explorerElement: explorerElement.value, // Left panel
    toolbarElement: toolbarElement.value, // Toolbar
    inspectorElement: inspectorElement.value, // Right panel
    navCubeCanvasElement: navCubeCanvasElement.value,
    busyModelBackdropElement: viewerElement.value,
    enableEditModels: true,
  });

  bimViewer.value.setConfigs({
    showSpaces: false, // Default
    selectedGlowThrough: true,
    highlightGlowThrough: true,
    dtxEnabled: true, // Enable data texture scene representation for models - may be slow on low-spec GPUs
  });

  bimViewer.value.localeService.on('updated', () => {
    const localizedElements = document.querySelectorAll('.xeokit-i18n');

    localizedElements.forEach((localizedElement: any) => {
      if (localizedElement.dataset.xeokitI18n) {
        localizedElement.innerText = bimViewer.value.localeService.translate(
          localizedElement.dataset.xeokitI18n,
        );
      }

      if (localizedElement.dataset.xeokitI18ntip) {
        const translation = bimViewer.value.localeService.translate(
          localizedElement.dataset.xeokitI18ntip,
        );
        if (translation) {
          localizedElement.dataset.tippyContent = bimViewer.value.localeService.translate(
            localizedElement.dataset.xeokitI18ntip,
          );
        }
      }

      if (localizedElement.dataset.tippyContent) {
        if (localizedElement._tippy) {
          localizedElement._tippy.setContent(localizedElement.dataset.tippyContent);
        } else {
          tippy(localizedElement, {
            appendTo: 'parent',
            zIndex: 1000000,
            allowHTML: true,
          });
        }
      }
    });
  });

  bimViewer.value.on('openExplorer', onViewerOpenExplorer);
  bimViewer.value.on('openInspector', onViewerOpenInspector);
  bimViewer.value.on('addModel', onViewerAddModel);
  bimViewer.value.on('editModel', onViewerEditModel);
  bimViewer.value.on('deleteModel', onViewerDeleteModel);

  server.value.getProjects(
    ({ projects: projectsArray }) => {
      for (const project of projectsArray) {
        projects.value.push({
          id: project.id,
          label: project.name,
        });
      }
    },
    (error) => console.error(error),
  );

  if (selectedProject.value) {
    isLoading.value = true;
    loadProject(selectedProject.value);
  }
}

function loadProject(projectId: string, modelId?: string, tab?: string) {
  if (!bimViewer.value) return;

  bimViewer.value.loadProject(
    projectId,
    () => {
      if (modelId) bimViewer.value.loadModel(modelId, null, null);
      if (tab) bimViewer.value.openTab(tab);
      bimViewer.value.resetView();
    },
    (error) => {
      console.error(error);
      isLoading.value = false;
    },
  );
}

function onViewerOpenExplorer() {}

function onViewerOpenInspector() {}

function onViewerAddModel(event) {
  console.log('addModel: ' + JSON.stringify(event, null, '\t'));
}

function onViewerEditModel(event) {
  console.log('editModel: ' + JSON.stringify(event, null, '\t'));
}

function onViewerDeleteModel(event) {
  console.log('deleteModel: ' + JSON.stringify(event, null, '\t'));
}

watch(
  () => selectedProject.value,
  (newValue) => {
    if (newValue) {
      isLoading.value = true;
      loadProject(newValue);
    }
  },
);
</script>
