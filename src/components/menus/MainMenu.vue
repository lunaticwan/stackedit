<template>
  <div class="side-bar__panel side-bar__panel--menu">
    <div class="side-bar__info">
      <div class="menu-entry menu-entry--info flex flex--row flex--align-center">
        <div class="menu-entry__icon menu-entry__icon--disabled">
          <icon-sync-off></icon-sync-off>
        </div>
        <span><b>{{currentWorkspace.name}}</b> (단독 로컬 모드)</span>
      </div>
    </div>
    <menu-entry @click.native="setPanel('workspaces')">
      <icon-database slot="icon"></icon-database>
      <div><div class="menu-entry__label menu-entry__label--count" v-if="workspaceCount">{{workspaceCount}}</div> Workspaces</div>
      <span>다른 Workspace로 전환</span>
    </menu-entry>
    <menu-entry @click.native="setPanel('history')">
      <icon-history slot="icon"></icon-history>
      <div>히스토리</div>
      <span>파일 변경 이력 추적 및 복원</span>
    </menu-entry>
    <menu-entry @click.native="fileProperties">
      <icon-view-list slot="icon"></icon-view-list>
      <div>파일 속성</div>
      <span>메타데이터 추가 및 확장 기능 설정</span>
    </menu-entry>
    <hr>
    <menu-entry @click.native="setPanel('toc')">
      <icon-toc slot="icon"></icon-toc>
      목차 (TOC)
    </menu-entry>
    <menu-entry @click.native="setPanel('help')">
      <icon-help-circle slot="icon"></icon-help-circle>
      Markdown 치트시트
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
    <menu-entry @click.native="badges">
      <icon-seal slot="icon"></icon-seal>
      <div><div class="menu-entry__label menu-entry__label--count">{{badgeCount}}/{{featureCount}}</div> 뱃지</div>
      <span>앱 기능 목록 및 획득한 뱃지 확인</span>
    </menu-entry>
    <menu-entry @click.native="templates">
      <icon-code-braces slot="icon"></icon-code-braces>
      <div><div class="menu-entry__label menu-entry__label--count">{{templateCount}}</div> 템플릿</div>
      <span>내보내기용 Handlebars 템플릿 설정</span>
    </menu-entry>
    <menu-entry @click.native="settings">
      <icon-settings slot="icon"></icon-settings>
      <div>설정</div>
      <span>애플리케이션 및 단축키 설정</span>
    </menu-entry>
    <hr>
    <menu-entry @click.native="setPanel('workspaceBackups')">
      <icon-content-save slot="icon"></icon-content-save>
      Workspace 백업
    </menu-entry>
    <menu-entry @click.native="reset">
      <icon-logout slot="icon"></icon-logout>
      애플리케이션 초기화
    </menu-entry>
    <menu-entry @click.native="about">
      <icon-help-circle slot="icon"></icon-help-circle>
      StackEdit 정보
    </menu-entry>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MenuEntry from './common/MenuEntry';
import store from '../../store';

export default {
  components: {
    MenuEntry,
  },
  computed: {
    ...mapGetters('workspace', [
      'currentWorkspace',
    ]),
    workspaceCount() {
      return Object.keys(store.getters['workspace/workspacesById']).length;
    },
    templateCount() {
      return Object.keys(store.getters['data/allTemplatesById']).length;
    },
    badgeCount() {
      return store.getters['data/allBadges'].filter(badge => badge.isEarned).length;
    },
    featureCount() {
      return store.getters['data/allBadges'].length;
    },
  },
  methods: {
    ...mapActions('data', {
      setPanel: 'setSideBarPanel',
    }),
    async fileProperties() {
      try {
        await store.dispatch('modal/open', 'fileProperties');
      } catch (e) {
        // Cancel
      }
    },
    print() {
      window.print();
    },
    async settings() {
      try {
        await store.dispatch('modal/open', 'settings');
      } catch (e) { /* Cancel */ }
    },
    async templates() {
      try {
        await store.dispatch('modal/open', 'templates');
      } catch (e) { /* Cancel */ }
    },
    async accounts() {
      try {
        await store.dispatch('modal/open', 'accountManagement');
      } catch (e) { /* Cancel */ }
    },
    async badges() {
      try {
        await store.dispatch('modal/open', 'badgeManagement');
      } catch (e) { /* Cancel */ }
    },
    async reset() {
      try {
        await store.dispatch('modal/open', 'reset');
        localStorage.setItem('resetStackEdit', '1');
        window.location.reload();
      } catch (e) { /* Cancel */ }
    },
    about() {
      store.dispatch('modal/open', 'about');
    },
  },
};
</script>
