<template>
  <modal-inner class="modal__inner-1--about-modal" aria-label="정보">
    <div class="modal__content">
      <div class="logo-background"></div>
      <h3>iM Markdown</h3>
      <hr>
      <small>v{{version}}</small>
      <h3>자주 묻는 질문</h3>
      <div class="faq" v-html="faq"></div>
    </div>
    <div class="modal__button-bar">
      <button class="button button--resolve" @click="config.resolve()">닫기</button>
    </div>
  </modal-inner>
</template>

<script>
import { mapGetters } from 'vuex';
import ModalInner from './common/ModalInner';
import markdownConversionSvc from '../../services/markdownConversionSvc';
import faq from '../../data/faq.md';

export default {
  components: {
    ModalInner,
  },
  data: () => ({
    version: VERSION,
  }),
  computed: {
    ...mapGetters('modal', [
      'config',
    ]),
    faq() {
      return markdownConversionSvc.defaultConverter.render(faq);
    },
  },
};
</script>

<style lang="scss">
.modal__inner-1--about-modal {
  text-align: center;

  .logo-background {
    height: 75px;
    margin: 0.5em 0;
  }

  small {
    display: block;
  }

  hr {
    width: 160px;
    max-width: 100%;
    margin: 1.5em auto;
  }
}

.faq {
  font-size: 0.8em;
  line-height: 1.5;
}
</style>
