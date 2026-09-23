<template>
  <div class="side-bar flex flex--column">
    <div v-if="panel === 'menu'" class="side-title flex flex--row flex--align-center flex--space-between">
      <div class="side-title__actions flex flex--row">
        <button class="side-title__button button" @click="setPanel('importExport')" v-title="'가져오기/내보내기'">
          <icon-content-save></icon-content-save>
        </button>
        <button class="side-title__button button" @click="print" v-title="'인쇄'">
          <icon-printer></icon-printer>
        </button>
        <button class="side-title__button button" @click="settings" v-title="'설정'">
          <icon-settings></icon-settings>
        </button>
        <button class="side-title__button button" @click="reset" v-title="'애플리케이션 초기화'">
          <icon-logout></icon-logout>
        </button>
      </div>
      <div class="side-title__close">
        <button class="side-title__button button" @click="toggleSideBar(false)" v-title="'사이드바 닫기'">
          <icon-panel-right-close></icon-panel-right-close>
        </button>
      </div>
    </div>
    <div v-else class="side-title flex flex--row flex--align-center flex--space-between">
      <div class="flex flex--row flex--align-center flex-1">
        <button class="side-title__button button" @click="setPanel('menu')" v-title="'목차로 돌아가기'">
          <icon-arrow-left></icon-arrow-left>
        </button>
        <div class="side-title__title">
          {{panelName}}
        </div>
      </div>
      <div class="side-title__close">
        <button class="side-title__button button" @click="toggleSideBar(false)" v-title="'사이드바 닫기'">
          <icon-panel-right-close></icon-panel-right-close>
        </button>
      </div>
    </div>
    <div class="side-bar__inner">
      <div class="side-bar__panel side-bar__panel--toc" v-show="panel === 'menu'">
        <toc></toc>
      </div>
      <import-export-menu v-if="panel === 'importExport'"></import-export-menu>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Toc from './Toc';
import ImportExportMenu from './menus/ImportExportMenu';
import store from '../store';

const panelNames = {
  menu: '목차',
  importExport: '가져오기/내보내기',
};

export default {
  components: {
    Toc,
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
    print() {
      window.print();
    },
    async settings() {
      try {
        await store.dispatch('modal/open', 'settings');
      } catch (e) { /* Cancel */ }
    },
    async reset() {
      try {
        await store.dispatch('modal/open', 'reset');
        localStorage.setItem('resetStackEdit', '1');
        window.location.reload();
      } catch (e) { /* Cancel */ }
    },
  },
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

.side-bar {
  overflow: hidden;
  height: 100%;

  hr {
    margin: 6px 10px;
    border: none;
    border-top: 1px solid $hr-color;
  }

  .textfield {
    font-size: 14px;
    height: 26px;
  }
}

.side-bar__inner {
  position: relative;
  height: 100%;
  overflow: hidden;
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
