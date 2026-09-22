<template>
  <div class="side-bar flex flex--column">
    <div class="side-title flex flex--row">
      <button v-if="panel !== 'menu'" class="side-title__button button" @click="setPanel('menu')" v-title="'메인 메뉴'">
        <icon-dots-horizontal></icon-dots-horizontal>
      </button>
      <div class="side-title__title">
        {{panelName}}
      </div>
      <button class="side-title__button button" @click="toggleSideBar(false)" v-title="'사이드바 닫기'">
        <icon-close></icon-close>
      </button>
    </div>
    <div class="side-bar__inner">
      <main-menu v-if="panel === 'menu'"></main-menu>
      <import-export-menu v-else-if="panel === 'importExport'"></import-export-menu>
      <div class="side-bar__panel side-bar__panel--toc" :class="{'side-bar__panel--hidden': panel !== 'toc'}">
        <toc>
        </toc>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Toc from './Toc';
import MainMenu from './menus/MainMenu';
import ImportExportMenu from './menus/ImportExportMenu';
import store from '../store';

const panelNames = {
  menu: '메뉴',
  toc: '목차 (TOC)',
  importExport: '가져오기/내보내기',
};

export default {
  components: {
    Toc,
    MainMenu,
    ImportExportMenu,
  },
  computed: {
    panel() {
      if (store.state.light) {
        return null; // No menu in light mode
      }
      const result = store.getters['data/layoutSettings'].sideBarPanel;
      return panelNames[result] ? result : 'menu';
    },
    panelName() {
      return panelNames[this.panel];
    },
  },
  methods: {
    ...mapActions('data', [
      'toggleSideBar',
    ]),
    ...mapActions('data', {
      setPanel: 'setSideBarPanel',
    }),
  },
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

.side-bar {
  overflow: hidden;
  height: 100%;

  hr {
    margin: 10px 40px;
    display: none;
    border-top: 1px solid $hr-color;
  }

  * + hr {
    display: block;
  }

  hr + hr {
    display: none;
  }

  .textfield {
    font-size: 14px;
    height: 26px;
  }
}

.side-bar__inner {
  position: relative;
  height: 100%;
}

.side-bar__panel {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;

  &::after {
    content: '';
    display: block;
    height: 40px;
  }
}

.side-bar__panel--hidden {
  left: 1000px;
}

.side-bar__panel--menu {
  padding: 10px;
}

.side-bar__info {
  padding: 10px;
  margin: -10px -10px 10px;
  background-color: $info-bg;
  font-size: 0.9375em;

  p {
    margin: 10px 15px;
    font-size: 0.875em;
    opacity: 0.67;
    line-height: 1.3;
  }
}
</style>
