import { useEffect, useRef, useState } from 'react';
import tippy from 'tippy.js';
import { BIMViewer, LocaleService, Server, messages as localeMessages } from 'xeokit-bim-viewer';

import 'https://kit.fontawesome.com/d129036538.js';
import 'tippy.js/dist/tippy.css';
import 'xeokit-bim-viewer/dist/xeokit-bim-viewer.css';
import './Viewer.css';

function Viewer() {
  const server = useRef<Server>(null);
  const bimViewer = useRef<BIMViewer>(null);
  const viewerLoaded = useRef(false);
  const canvasElement = useRef();
  const explorerElement = useRef();
  const toolbarElement = useRef();
  const inspectorElement = useRef();
  const navCubeCanvasElement = useRef();
  const viewerElement = useRef();

  const [selectedProject, setSelectedProject] = useState('OTCConferenceCenter');
  const [projects, setProjects] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    if (!viewerLoaded.current) {
      viewerLoaded.current = true;
      loadViewer();
    }
  });

  function loadViewer() {
    server.current = new Server({
      dataDir: './',
    });

    bimViewer.current = new BIMViewer(server.current, {
      localeService: new LocaleService({
        messages: localeMessages,
        locale: 'en',
      }),
      canvasElement: canvasElement.current, // WebGL canvas
      keyboardEventsElement: document, // Optional, defaults to document
      explorerElement: explorerElement.current, // Left panel
      toolbarElement: toolbarElement.current, // Toolbar
      inspectorElement: inspectorElement.current, // Right panel
      navCubeCanvasElement: navCubeCanvasElement.current,
      busyModelBackdropElement: viewerElement.current,
      enableEditModels: true,
    });

    bimViewer.current.setConfigs({
      showSpaces: false, // Default
      selectedGlowThrough: true,
      highlightGlowThrough: true,
      dtxEnabled: true, // Enable data texture scene representation for models - may be slow on low-spec GPUs
    });

    bimViewer.current.localeService.on('updated', () => {
      const localizedElements = document.querySelectorAll('.xeokit-i18n');

      localizedElements.forEach((localizedElement: any) => {
        if (localizedElement.dataset.xeokitI18n) {
          localizedElement.innerText = bimViewer.current.localeService.translate(
            localizedElement.dataset.xeokitI18n,
          );
        }

        if (localizedElement.dataset.xeokitI18ntip) {
          const translation = bimViewer.current.localeService.translate(
            localizedElement.dataset.xeokitI18ntip,
          );
          if (translation) {
            localizedElement.dataset.tippyContent = bimViewer.current.localeService.translate(
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

    bimViewer.current.on('openExplorer', onViewerOpenExplorer);
    bimViewer.current.on('openInspector', onViewerOpenInspector);
    bimViewer.current.on('addModel', onViewerAddModel);
    bimViewer.current.on('editModel', onViewerEditModel);
    bimViewer.current.on('deleteModel', onViewerDeleteModel);

    server.current.getProjects(
      ({ projects: projectsArray }) => {
        for (const project of projectsArray) {
          setProjects((projects) => [...projects, { id: project.id, label: project.name }]);
        }
      },
      (error) => console.error(error),
    );

    loadProject(selectedProject);
  }

  function loadProject(projectId: string, modelId?: string, tab?: string) {
    if (!bimViewer.current) return;

    bimViewer.current.loadProject(
      projectId,
      () => {
        if (modelId) bimViewer.current.loadModel(modelId, null, null);
        if (tab) bimViewer.current.openTab(tab);
        bimViewer.current.resetView();
      },
      (error) => {
        console.error(error);
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

  function onProjectSelectChange(event) {
    const projectId = event.target.value;
    setSelectedProject(projectId);
    loadProject(projectId);
  }

  return (
    <>
      <input type="checkbox" id="explorer-toggle" />
      <label
        htmlFor="explorer-toggle"
        className="xeokit-i18n explorer-toggle-label xeokit-btn fas fa-2x fa-sitemap"
        data-xeokit-i18ntip="toolbar.toggleExplorer"
        data-tippy-content="Toggle explorer"
      />
      <input type="checkbox" id="inspector-toggle" />
      <label
        id="inspector-toggle-label"
        htmlFor="inspector-toggle"
        className="xeokit-i18n inspector-toggle-label xeokit-btn fas fa-info-circle fa-2x"
        data-xeokit-i18ntip="toolbar.toggleProperties"
        data-tippy-content="Toggle properties"
      />
      <div id="explorer" ref={explorerElement} />
      <div id="toolbar" ref={toolbarElement} />
      <div id="inspector" ref={inspectorElement} />

      <select id="project-select" onChange={onProjectSelectChange} value={selectedProject}>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.label}
          </option>
        ))}
      </select>

      <div id="viewer" ref={viewerElement}>
        <canvas id="canvas" ref={canvasElement} />
        <canvas id="nav-cube-canvas" ref={navCubeCanvasElement} />
      </div>
    </>
  );
}

export default Viewer;
