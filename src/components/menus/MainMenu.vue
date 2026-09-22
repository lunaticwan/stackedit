<template>
  <div class="side-bar__panel side-bar__panel--menu">
    <menu-entry @click.native="setPanel('toc')">
      <icon-toc slot="icon"></icon-toc>
      목차 (TOC)
    </menu-entry>
    <hr>
    <menu-entry @click.native="setPanel('importExport')">
      <icon-content-save slot="icon"></icon-content-save>
      가져오기/내보내기
    </menu-entry>
    <menu-entry @click.native="print">
      <icon-printer slot="icon"></icon-printer>
      인쇄
    </menu-entry>
    <hr>
    <menu-entry @click.native="settings">
      <icon-settings slot="icon"></icon-settings>
      <div>설정</div>
      <span>애플리케이션 및 단축키 설정</span>
    </menu-entry>
    <hr>
    <menu-entry @click.native="reset">
      <icon-logout slot="icon"></icon-logout>
      애플리케이션 초기화
    </menu-entry>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import MenuEntry from './common/MenuEntry';
import store from '../../store';

export default {
  components: {
    MenuEntry,
  },
  methods: {
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
    async accounts() {
      try {
        await store.dispatch('modal/open', 'accountManagement');
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
