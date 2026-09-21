<template>
  <modal-inner aria-label="PDF로 내보내기">
    <div class="modal__content">
      <p><b>PDF 내보내기</b>에 사용할 템플릿을 선택하세요.</p>
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
      <button class="button" @click="config.reject()">취소</button>
      <button class="button button--resolve" @click="resolve()">확인</button>
    </div>
  </modal-inner>
</template>

<script>
import exportSvc from '../../services/exportSvc';
import modalTemplate from './common/modalTemplate';
import store from '../../store';

export default modalTemplate({
  computedLocalSettings: {
    selectedTemplate: 'pdfExportTemplate',
  },
  methods: {
    async resolve() {
      this.config.resolve();
      const currentFile = store.getters['file/current'];
      store.dispatch('queue/enqueue', async () => {
        try {
          // 템플릿 적용 HTML 생성
          const html = await exportSvc.applyTemplate(
            currentFile.id,
            this.allTemplatesById[this.selectedTemplate],
            true,
          );

          // 클라이언트 측 인쇄 프레임 생성
          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.right = '0';
          iframe.style.bottom = '0';
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.border = '0';
          document.body.appendChild(iframe);

          const frameDoc = iframe.contentWindow.document;
          frameDoc.open();
          frameDoc.write(html);
          frameDoc.close();

          // 현재 문서 스타일 복사 및 주입
          const headStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
          headStyles.forEach((styleNode) => {
            frameDoc.head.appendChild(styleNode.cloneNode(true));
          });

          // 인쇄 창 호출 및 노드 정리
          setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            }, 2000);
          }, 300);
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
          store.dispatch('notification/error', err);
        }
      });
    },
  },
});
</script>
