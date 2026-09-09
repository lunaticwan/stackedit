<template>
  <modal-inner aria-label="이미지 삽입">
    <div class="modal__content">
      <p>이미지 <b>URL</b>을 입력하세요.</p>
      <form-entry label="URL" error="url">
        <input slot="field" class="textfield" type="text" v-model.trim="url" @keydown.enter="resolve">
      </form-entry>
      <menu-entry @click.native="openGooglePhotos(token)" v-for="token in googlePhotosTokens" :key="token.sub">
        <icon-provider slot="icon" provider-id="googlePhotos"></icon-provider>
        <div>Google Photos에서 열기</div>
        <span>{{token.name}}</span>
      </menu-entry>
      <menu-entry @click.native="addGooglePhotosAccount">
        <icon-provider slot="icon" provider-id="googlePhotos"></icon-provider>
        <span>Google Photos 계정 추가</span>
      </menu-entry>
    </div>
    <div class="modal__button-bar">
      <button class="button" @click="reject()">취소</button>
      <button class="button button--resolve" @click="resolve">확인</button>
    </div>
  </modal-inner>
</template>

<script>
import modalTemplate from './common/modalTemplate';
import MenuEntry from '../menus/common/MenuEntry';
import googleHelper from '../../services/providers/helpers/googleHelper';
import store from '../../store';

export default modalTemplate({
  components: {
    MenuEntry,
  },
  data: () => ({
    url: '',
  }),
  computed: {
    googlePhotosTokens() {
      const googleTokensBySub = store.getters['data/googleTokensBySub'];
      return Object.values(googleTokensBySub)
        .filter(token => token.isPhotos)
        .sort((token1, token2) => token1.name.localeCompare(token2.name));
    },
  },
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
    async addGooglePhotosAccount() {
      try {
        await googleHelper.addPhotosAccount();
      } catch (e) { /* cancel */ }
    },
    async openGooglePhotos(token) {
      const { callback } = this.config;
      this.config.reject();
      const res = await googleHelper.openPicker(token, 'img');
      if (res[0]) {
        store.dispatch('modal/open', {
          type: 'googlePhoto',
          url: res[0].url,
          callback,
        });
      }
    },
  },
});
</script>
