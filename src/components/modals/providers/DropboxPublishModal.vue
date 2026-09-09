<template>
  <modal-inner aria-label="Dropbox에 게시">
    <div class="modal__content">
      <div class="modal__image">
        <icon-provider provider-id="dropbox"></icon-provider>
      </div>
      <p><b>{{currentFileName}}</b>을(를) <b>Dropbox</b>에 게시합니다.</p>
      <form-entry label="파일 경로" error="path">
        <input slot="field" class="textfield" type="text" v-model.trim="path" @keydown.enter="resolve()">
        <div class="form-entry__info">
          <b>예시:</b> {{config.token.fullAccess ? '' : '/Applications/StackEdit (restricted)'}}/path/to/My Document.html<br>
          파일이 존재하면 덮어씁니다.
        </div>
      </form-entry>
      <form-entry label="템플릿">
        <select slot="field" class="textfield" v-model="selectedTemplate" @keydown.enter="resolve()">
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
import dropboxProvider from '../../../services/providers/dropboxProvider';
import modalTemplate from '../common/modalTemplate';

export default modalTemplate({
  data: () => ({
    path: '',
  }),
  computedLocalSettings: {
    selectedTemplate: 'dropboxPublishTemplate',
  },
  created() {
    this.path = `/${this.currentFileName}.html`;
  },
  methods: {
    resolve() {
      if (!dropboxProvider.checkPath(this.path)) {
        this.setError('path');
      } else {
        // Return new location
        const location = dropboxProvider.makeLocation(this.config.token, this.path);
        location.templateId = this.selectedTemplate;
        this.config.resolve(location);
      }
    },
  },
});
</script>
