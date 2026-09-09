<template>
  <modal-inner aria-label="HTML로 내보내기">
    <div class="modal__content">
      <p><b>HTML 내보내기</b>에 사용할 템플릿을 선택하세요.</p>
      <form-entry label="템플릿">
        <select class="textfield" slot="field" v-model="selectedTemplate" @keydown.enter="resolve()">
          <option v-for="(template, id) in allTemplatesById" :key="id" :value="id">
            {{ template.name }}
          </option>
        </select>
        <div class="form-entry__actions">
          <a href="javascript:void(0)" @click="configureTemplates">템플릿 설정</a>
        </div>
      </form-entry>
    </div>
    <div class="modal__button-bar">
      <button class="button button--copy" v-clipboard="result" @click="info('HTML이 클립보드에 복사되었습니다!')">복사</button>
      <button class="button" @click="config.reject()">취소</button>
      <button class="button button--resolve" @click="resolve()">확인</button>
    </div>
  </modal-inner>
</template>

<script>
import { mapActions } from 'vuex';
import exportSvc from '../../services/exportSvc';
import modalTemplate from './common/modalTemplate';
import store from '../../store';
import badgeSvc from '../../services/badgeSvc';

export default modalTemplate({
  data: () => ({
    result: '',
  }),
  computedLocalSettings: {
    selectedTemplate: 'htmlExportTemplate',
  },
  mounted() {
    let timeoutId;
    this.$watch('selectedTemplate', (selectedTemplate) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const currentFile = store.getters['file/current'];
        const html = await exportSvc.applyTemplate(
          currentFile.id,
          this.allTemplatesById[selectedTemplate],
        );
        this.result = html;
      }, 10);
    }, {
      immediate: true,
    });
  },
  methods: {
    ...mapActions('notification', [
      'info',
    ]),
    async resolve() {
      const { config } = this;
      const currentFile = store.getters['file/current'];
      config.resolve();
      await exportSvc.exportToDisk(currentFile.id, 'html', this.allTemplatesById[this.selectedTemplate]);
      badgeSvc.addBadge('exportHtml');
    },
  },
});
</script>
