<template>
  <modal-inner aria-label="Dropbox와 동기화">
    <div class="modal__content">
      <div class="modal__image">
        <icon-provider provider-id="dropbox"></icon-provider>
      </div>
      <p><b>{{currentFileName}}</b>을(를) <b>Dropbox</b>에 저장하고 동기화합니다.</p>
      <form-entry label="파일 경로" error="path">
        <input slot="field" class="textfield" type="text" v-model.trim="path" @keydown.enter="resolve()">
        <div class="form-entry__info">
          <b>예시:</b> {{config.token.fullAccess ? '' : '/Applications/StackEdit (restricted)'}}/path/to/My Document.md<br>
          파일이 존재하면 덮어씁니다.
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
  created() {
    this.path = `/${this.currentFileName}.md`;
  },
  methods: {
    resolve() {
      if (!dropboxProvider.checkPath(this.path)) {
        this.setError('path');
      } else {
        // Return new location
        const location = dropboxProvider.makeLocation(this.config.token, this.path);
        this.config.resolve(location);
      }
    },
  },
});
</script>
