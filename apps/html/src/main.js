import {
  BIMViewer,
  LocaleService,
  Server,
} from 'https://cdn.jsdelivr.net/npm/@xeokit/xeokit-bim-viewer@2.5.1-beta-22';
import { messages as localeMessages } from 'https://cdn.jsdelivr.net/npm/@xeokit/xeokit-bim-viewer@2.5.1-beta-22/dist/messages.js';

const defaultProject = 'OTCConferenceCenter';

window.onload = load;

async function load() {
  const server = new Server({
    dataDir: './public',
  });

  const bimViewer = new BIMViewer(server, {
    localeService: new LocaleService({
      messages: localeMessages,
      locale: 'en',
    }),
    canvasElement: document.getElementById('canvas'), // WebGL canvas
    keyboardEventsElement: document, // Optional, defaults to document
    explorerElement: document.getElementById('explorer'), // Left panel
    toolbarElement: document.getElementById('toolbar'), // Toolbar
    inspectorElement: document.getElementById('inspector'), // Right panel
    navCubeCanvasElement: document.getElementById('nav-cube-canvas'),
    busyModelBackdropElement: document.getElementById('viewer'),
    enableEditModels: true,
  });

  bimViewer.localeService.on('updated', () => {
    const localizedElements = document.querySelectorAll('.xeokit-i18n');
    localizedElements.forEach((localizedElement) => {
      if (localizedElement.dataset.xeokitI18n) {
        localizedElement.innerText = bimViewer.localeService.translate(
          localizedElement.dataset.xeokitI18n,
        );
      }
      if (localizedElement.dataset.xeokitI18ntip) {
        const translation = bimViewer.localeService.translate(
          localizedElement.dataset.xeokitI18ntip,
        );
        if (translation) {
          localizedElement.dataset.tippyContent = bimViewer.localeService.translate(
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

  bimViewer.setConfigs({
    showSpaces: false, // Default
    selectedGlowThrough: true,
    highlightGlowThrough: true,
    dtxEnabled: true, // Enable data texture scene representation for models - may be slow on low-spec GPUs
  });

  bimViewer.on('openExplorer', () => {
    setExplorerOpen(true);
  });

  bimViewer.on('openInspector', () => {
    setInspectorOpen(true);
  });

  bimViewer.on('addModel', (event) => {
    // "Add" selected in Models tab's context menu
    console.log('addModel: ' + JSON.stringify(event, null, '\t'));
  });

  bimViewer.on('editModel', (event) => {
    // "Edit" selected in Models tab's context menu
    console.log('editModel: ' + JSON.stringify(event, null, '\t'));
  });

  bimViewer.on('deleteModel', (event) => {
    // "Delete" selected in Models tab's context menu
    console.log('deleteModel: ' + JSON.stringify(event, null, '\t'));
  });

  window.bimViewer = bimViewer;

  server.getProjects(({ projects }) => {
    const projectSelect = document.getElementById('project-select');

    projectSelect.addEventListener('change', (event) => {
      bimViewer.unloadAllModels();
      bimViewer.unloadProject();

      const projectId = event.target.value;
      loadProject(projectId);
    });

    for (const project of projects) {
      const option = document.createElement('option');
      option.value = project.id;
      option.text = project.name;

      if (project.id === defaultProject) option.selected = true;

      projectSelect.add(option);
    }
  });

  loadProject(defaultProject);
}

function loadProject(projectId, modelId, tab) {
  window.bimViewer.loadProject(
    projectId,
    () => {
      if (modelId) bimViewer.loadModel(modelId);
      if (tab) bimViewer.openTab(tab);
      bimViewer.resetView();
    },
    (errorMsg) => {
      console.error(errorMsg);
      isLoading = false;
    },
  );
}

function setExplorerOpen(explorerOpen) {
  const toggle = document.getElementById('explorer-toggle');
  if (toggle) {
    toggle.checked = explorerOpen;
  }
}

function setInspectorOpen(inspectorOpen) {
  const toggle = document.getElementById('inspector-toggle');
  if (toggle) {
    toggle.checked = inspectorOpen;
  }
}
