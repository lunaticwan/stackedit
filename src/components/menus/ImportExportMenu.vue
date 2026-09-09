<template>
  <div class="side-bar__panel side-bar__panel--menu">
    <input class="hidden-file" id="import-markdown-file-input" type="file" @change="onImportMarkdown">
    <label class="menu-entry button flex flex--row flex--align-center" for="import-markdown-file-input">
      <div class="menu-entry__icon flex flex--column flex--center">
        <icon-upload></icon-upload>
      </div>
      <div class="flex flex--column">
        <div>Markdown 가져오기</div>
        <span>일반 텍스트 파일 가져오기</span>
      </div>
    </label>
    <input class="hidden-file" id="import-html-file-input" type="file" @change="onImportHtml">
    <label class="menu-entry button flex flex--row flex--align-center" for="import-html-file-input">
      <div class="menu-entry__icon flex flex--column flex--center">
        <icon-upload></icon-upload>
      </div>
      <div class="flex flex--column">
        <div>HTML 가져오기</div>
        <span>HTML 파일을 Markdown으로 변환</span>
      </div>
    </label>
    <hr>
    <menu-entry @click.native="exportMarkdown">
      <icon-download slot="icon"></icon-download>
      <div>Markdown으로 내보내기</div>
      <span>일반 텍스트 파일로 저장</span>
    </menu-entry>
    <menu-entry @click.native="exportHtml">
      <icon-download slot="icon"></icon-download>
      <div>HTML로 내보내기</div>
      <span>템플릿 기반 HTML 페이지 생성</span>
    </menu-entry>
    <menu-entry @click.native="exportPdf">
      <icon-download slot="icon"></icon-download>
      <div><div class="menu-entry__label" :class="{'menu-entry__label--warning': !isSponsor}">스폰서</div> PDF로 내보내기</div>
      <span>HTML 템플릿 기반 PDF 생성</span>
    </menu-entry>
    <menu-entry @click.native="exportPandoc">
      <icon-download slot="icon"></icon-download>
      <div><div class="menu-entry__label" :class="{'menu-entry__label--warning': !isSponsor}">스폰서</div> Pandoc으로 내보내기</div>
      <span>PDF, Word, EPUB 등으로 변환</span>
    </menu-entry>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TurndownService from 'turndown/lib/turndown.browser.umd';
import htmlSanitizer from '../../libs/htmlSanitizer';
import MenuEntry from './common/MenuEntry';
import Provider from '../../services/providers/common/Provider';
import store from '../../store';
import workspaceSvc from '../../services/workspaceSvc';
import exportSvc from '../../services/exportSvc';
import badgeSvc from '../../services/badgeSvc';

const turndownService = new TurndownService(store.getters['data/computedSettings'].turndown);

const readFile = file => new Promise((resolve) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (content.match(/\uFFFD/)) {
        store.dispatch('notification/error', '파일을 읽을 수 없습니다.');
      } else {
        resolve(content);
      }
    };
    reader.readAsText(file);
  }
});

export default {
  components: {
    MenuEntry,
  },
  computed: mapGetters(['isSponsor']),
  methods: {
    async onImportMarkdown(evt) {
      const file = evt.target.files[0];
      const content = await readFile(file);
      const item = await workspaceSvc.createFile({
        ...Provider.parseContent(content),
        name: file.name,
      });
      store.commit('file/setCurrentId', item.id);
      badgeSvc.addBadge('importMarkdown');
    },
    async onImportHtml(evt) {
      const file = evt.target.files[0];
      const content = await readFile(file);
      const sanitizedContent = htmlSanitizer.sanitizeHtml(content)
        .replace(/&#160;/g, ' '); // Replace non-breaking spaces with classic spaces
      const item = await workspaceSvc.createFile({
        ...Provider.parseContent(turndownService.turndown(sanitizedContent)),
        name: file.name,
      });
      store.commit('file/setCurrentId', item.id);
      badgeSvc.addBadge('importHtml');
    },
    async exportMarkdown() {
      const currentFile = store.getters['file/current'];
      try {
        await exportSvc.exportToDisk(currentFile.id, 'md');
        badgeSvc.addBadge('exportMarkdown');
      } catch (e) { /* Cancel */ }
    },
    async exportHtml() {
      try {
        await store.dispatch('modal/open', 'htmlExport');
      } catch (e) { /* Cancel */ }
    },
    async exportPdf() {
      try {
        await store.dispatch('modal/open', 'pdfExport');
      } catch (e) { /* Cancel */ }
    },
    async exportPandoc() {
      try {
        await store.dispatch('modal/open', 'pandocExport');
      } catch (e) { /* Cancel */ }
    },
  },
};
</script>
