<template>
  <input type="checkbox" id="explorer-toggle" />

  <label
    for="explorer-toggle"
    class="xeokit-i18n explorer-toggle-label xeokit-btn fas fa-2x fa-sitemap"
    data-xeokit-i18ntip="toolbar.toggleExplorer"
    data-tippy-content="Toggle explorer"
  ></label>

  <input type="checkbox" id="inspector-toggle" />

  <label
    id="inspector-toggle-label"
    for="inspector-toggle"
    class="xeokit-i18n inspector-toggle-label xeokit-btn fas fa-info-circle fa-2x"
    data-xeokit-i18ntip="toolbar.toggleProperties"
    data-tippy-content="Toggle properties"
  ></label>

  <div id="explorer"></div>

  <div id="toolbar"></div>

  <div id="inspector"></div>

  <select id="project-select"></select>

  <div id="viewer">
    <canvas id="canvas"></canvas>
    <canvas id="nav-cube-canvas"></canvas>
  </div>
</template>

<script lang="ts" setup></script>
