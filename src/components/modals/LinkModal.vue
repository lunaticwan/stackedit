<template>
  <modal-inner aria-label="링크 삽입">
    <div class="modal__content">
      <p>링크 <b>URL</b>을 입력하세요.</p>
      <form-entry label="URL" error="url">
        <input slot="field" class="textfield" type="text" v-model.trim="url" @keydown.enter="resolve">
      </form-entry>
    </div>
    <div class="modal__button-bar">
      <button class="button" @click="reject()">취소</button>
      <button class="button button--resolve" @click="resolve">확인</button>
    </div>
  </modal-inner>
</template>

<script>
import modalTemplate from './common/modalTemplate';

export default modalTemplate({
  data: () => ({
    url: '',
  }),
  methods: {
    resolve(evt) {
      evt.preventDefault(); // Fixes https://github.com/benweet/stackedit/issues/1503
      if (!this.url) {
        this.setError('url');
      } else {
        const { callback } = this.config;
        this.config.resolve();
        callback(this.url);
      }
    },
    reject() {
      const { callback } = this.config;
      this.config.reject();
      callback(null);
    },
  },
});
</script>
