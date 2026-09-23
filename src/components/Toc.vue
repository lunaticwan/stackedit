<template>
  <div class="toc">
    <div class="toc__mask" :style="{top: (maskY - 5) + 'px'}"></div>
    <div class="toc__inner"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import editorSvc from '../services/editorSvc';

export default {
  data: () => ({
    maskY: 0,
  }),
  computed: {
    ...mapGetters('layout', [
      'styles',
    ]),
  },
  mounted() {
    const tocElt = this.$el.querySelector('.toc__inner');

    // TOC click behaviour
    let isMousedown;
    function onClick(e) {
      if (!isMousedown) {
        return;
      }
      e.preventDefault();
      const y = e.clientY - tocElt.getBoundingClientRect().top;

      editorSvc.previewCtx.sectionDescList.some((sectionDesc) => {
        if (y >= sectionDesc.tocDimension.endOffset) {
          return false;
        }
        const posInSection = (y - sectionDesc.tocDimension.startOffset)
          / (sectionDesc.tocDimension.height || 1);
        const editorScrollTop = sectionDesc.editorDimension.startOffset
          + (sectionDesc.editorDimension.height * posInSection);
        editorSvc.editorElt.parentNode.scrollTop = editorScrollTop;
        const previewScrollTop = sectionDesc.previewDimension.startOffset
          + (sectionDesc.previewDimension.height * posInSection);
        editorSvc.previewElt.parentNode.scrollTop = previewScrollTop;
        return true;
      });
    }

    tocElt.addEventListener('mouseup', () => {
      isMousedown = false;
    });
    tocElt.addEventListener('mouseleave', () => {
      isMousedown = false;
    });
    tocElt.addEventListener('mousedown', (e) => {
      isMousedown = e.which === 1;
      onClick(e);
    });
    tocElt.addEventListener('mousemove', (e) => {
      onClick(e);
    });

    // Change mask postion on scroll
    const updateMaskY = () => {
      const scrollPosition = editorSvc.getScrollPosition();
      if (scrollPosition) {
        const sectionDesc = editorSvc.previewCtxMeasured.sectionDescList[scrollPosition.sectionIdx];
        this.maskY = sectionDesc.tocDimension.startOffset +
          (scrollPosition.posInSection * sectionDesc.tocDimension.height);
      }
    };

    this.$nextTick(() => {
      editorSvc.editorElt.parentNode.addEventListener('scroll', () => {
        if (this.styles.showEditor) {
          updateMaskY();
        }
      });
      editorSvc.previewElt.parentNode.addEventListener('scroll', () => {
        if (!this.styles.showEditor) {
          updateMaskY();
        }
      });
    });
  },
};
</script>

<style lang="scss">
.toc__inner {
  position: relative;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  font-size: 14px;
  line-height: 1.5;
  padding: 14px 16px 40px;
  white-space: normal;
  word-break: break-word;
  user-select: none;

  .app--dark & {
    color: rgba(255, 255, 255, 0.85);
  }

  * {
    pointer-events: none;
  }

  .cl-toc-section {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.45;
      border: none;
      padding: 0;

      &::after {
        display: none;
      }
    }

    h1 {
      font-size: 14px;
      font-weight: 600;
      margin: 10px 0 4px;
    }

    h2 {
      font-size: 13px;
      font-weight: 600;
      margin: 8px 0 3px 12px;
    }

    h3 {
      font-size: 13px;
      font-weight: 500;
      margin: 6px 0 2px 22px;
    }

    h4 {
      font-size: 12px;
      font-weight: 400;
      margin: 4px 0 2px 32px;
      opacity: 0.9;
    }

    h5 {
      font-size: 12px;
      font-weight: 400;
      margin: 3px 0 1px 40px;
      opacity: 0.8;
    }

    h6 {
      font-size: 12px;
      font-weight: 400;
      margin: 2px 0 0 48px;
      opacity: 0.7;
    }
  }
}

.toc__mask {
  position: absolute;
  left: 0;
  width: 100%;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.2);
  pointer-events: none;
}
</style>
