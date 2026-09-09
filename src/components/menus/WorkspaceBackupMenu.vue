<template>
  <div class="side-bar__panel side-bar__panel--menu">
    <input class="hidden-file" id="import-backup-file-input" type="file" @change="onImportBackup">
    <label class="menu-entry button flex flex--row flex--align-center" for="import-backup-file-input">
      <div class="menu-entry__icon flex flex--column flex--center">
        <icon-content-save></icon-content-save>
      </div>
      <div class="flex flex--column">
        Workspace 백업 가져오기
      </div>
    </label>
    <menu-entry @click.native="exportWorkspace">
      <icon-content-save slot="icon"></icon-content-save>
      Workspace 백업 내보내기
    </menu-entry>
  </div>
</template>

<script>
import FileSaver from 'file-saver';
import MenuEntry from './common/MenuEntry';
import store from '../../store';
import backupSvc from '../../services/backupSvc';
import localDbSvc from '../../services/localDbSvc';

export default {
  components: {
    MenuEntry,
  },
  computed: {
    workspaceId: () => store.getters['workspace/currentWorkspace'].id,
  },
  methods: {
    onImportBackup(evt) {
      const file = evt.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          if (text.match(/\uFFFD/)) {
            store.dispatch('notification/error', '파일을 읽을 수 없습니다.');
          } else {
            backupSvc.importBackup(text);
          }
        };
        const blob = file.slice(0, 10000000);
        reader.readAsText(blob);
      }
    },
    exportWorkspace() {
      const allItemsById = {};
      localDbSvc.getWorkspaceItems(this.workspaceId, (item) => {
        allItemsById[item.id] = item;
      }, () => {
        const backup = JSON.stringify(allItemsById);
        const blob = new Blob([backup], {
          type: 'text/plain;charset=utf-8',
        });
        FileSaver.saveAs(blob, 'iM뱅크MD workspace.json');
      });
    },
  },
};
</script>
