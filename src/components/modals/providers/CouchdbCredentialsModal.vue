<template>
  <modal-inner aria-label="Insert image">
    <div class="modal__content">
      <div class="modal__image">
        <icon-provider provider-id="couchdb"></icon-provider>
      </div>
      <p>Please provide your credentials to login to <b>CouchDB</b>.</p>
      <form-entry label="이름" error="name">
        <input slot="field" class="textfield" type="text" v-model.trim="name" @keydown.enter="resolve()">
      </form-entry>
      <form-entry label="비밀번호" error="password">
        <input slot="field" class="textfield" type="password" v-model.trim="password" @keydown.enter="resolve()">
      </form-entry>
    </div>
    <div class="modal__button-bar">
      <button class="button" @click="config.reject()">취소</button>
      <button class="button button--resolve" @click="resolve()">확인</button>
    </div>
  </modal-inner>
</template>

<script>
import modalTemplate from '../common/modalTemplate';
import store from '../../../store';

export default modalTemplate({
  data: () => ({
    name: '',
    password: '',
  }),
  created() {
    this.name = this.config.token.name;
    this.password = this.config.token.password;
  },
  methods: {
    resolve() {
      if (!this.name) {
        this.setError('name');
      }
      if (!this.password) {
        this.setError('password');
      }
      if (this.name && this.password) {
        const token = {
          ...this.config.token,
          name: this.name,
          password: this.password,
        };
        store.dispatch('data/addCouchdbToken', token);
        this.config.resolve();
      }
    },
  },
});
</script>
