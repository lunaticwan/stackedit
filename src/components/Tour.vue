<template>
  <div class="tour" @keydown.esc.stop="skip">
    <div class="tour-step" :class="'tour-step--' + step" :style="stepStyle">
      <div class="tour-step__inner" v-if="step === 'welcome'">
        <h2>환영합니다!</h2>
        <p>새로운 <b>StackEdit 5</b>를 만나보세요!</p>
        <p><b>다음</b>을 클릭하여 간단한 둘러보기를 진행하세요.</p>
        <div class="tour-step__button-bar">
          <button class="button" @click="finish">건너뛰기</button>
          <button class="button button--resolve" @click="next">다음</button>
        </div>
      </div>
      <div class="tour-step__inner" v-else-if="step === 'editor'">
        <h2>Markdown 에디터</h2>
        <p>StackEdit은 Markdown을 실시간으로 HTML로 변환합니다.</p>
        <p><icon-side-preview></icon-side-preview>를 클릭하여 사이드 미리보기를 토글하세요.</p>
        <div class="tour-step__button-bar">
          <button class="button" @click="finish">건너뛰기</button>
          <button class="button button--resolve" @click="next">다음</button>
        </div>
      </div>
      <div class="tour-step__inner" v-else-if="step === 'explorer'">
        <h2>파일 탐색기</h2>
        <p>StackEdit은 Workspace 내의 여러 파일과 폴더를 관리할 수 있습니다.</p>
        <p><icon-folder></icon-folder>를 클릭하여 파일 탐색기를 열 수 있습니다.</p>
        <div class="tour-step__button-bar">
          <button class="button" @click="finish">건너뛰기</button>
          <button class="button button--resolve" @click="next">다음</button>
        </div>
      </div>
      <div class="tour-step__inner" v-else-if="step === 'menu'">
        <h2>다양한 기능 활용</h2>
        <p>StackEdit으로 파일 동기화, 게시, 협업 Workspace 관리 등을 실행할 수 있습니다...</p>
        <p><icon-provider provider-id="stackedit"></icon-provider>를 클릭하여 메뉴를 둘러보세요.</p>
        <div class="tour-step__button-bar">
          <button class="button" @click="finish">건너뛰기</button>
          <button class="button button--resolve" @click="next">다음</button>
        </div>
      </div>
      <div class="tour-step__inner" v-else-if="step === 'end'">
        <h2>즐겁게 사용하세요!</h2>
        <p>StackEdit이 마음에 드신다면 <a target="_blank" href="https://chrome.google.com/webstore/detail/iiooodelglhkcpgbajoejffhijaclcdg/reviews">Chrome 웹 스토어</a>에 별점 5점을 남겨주세요.</p>
        <p><a target="_blank" href="https://github.com/benweet/stackedit">GitHub</a> 저장소에 Star를 누르고 <a target="_blank" href="https://community.stackedit.io/">커뮤니티</a>에 참여하세요.</p>
        <div class="tour-step__button-bar">
          <button class="button button--resolve" @click="finish">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import store from '../store';

const steps = [
  'welcome',
  'editor',
  'explorer',
  'menu',
  'end',
];

export default {
  data: () => ({
    stepIdx: 0,
    stepStyles: {},
  }),
  computed: {
    step() {
      return steps[this.stepIdx];
    },
    stepStyle() {
      return this.stepStyles[this.step] || {};
    },
  },
  methods: {
    updatePositions() {
      document.querySelectorAll('[tour-step-anchor]').cl_each((anchorElt) => {
        const anchorRect = anchorElt.getBoundingClientRect();
        const anchorSteps = (anchorElt.getAttribute('tour-step-anchor') || '').split(',');
        anchorSteps.forEach((step) => {
          const style = {
            top: `${anchorRect.top + (anchorRect.height / 2)}px`,
            left: `${anchorRect.left + (anchorRect.width / 2)}px`,
          };
          switch (step) {
            case 'welcome':
            case 'end': {
              style.top = `${anchorRect.top}px`;
              break;
            }
            case 'editor':
            case 'menu': {
              style.left = `${anchorRect.left}px`;
              break;
            }
            case 'explorer': {
              style.left = `${anchorRect.left + anchorRect.width}px`;
              break;
            }
            default:
              return;
          }
          Vue.set(this.stepStyles, step, style);
        });
      });
    },
    finish() {
      store.dispatch('data/patchLayoutSettings', {
        welcomeTourFinished: true,
      });
    },
    next() {
      this.stepIdx += 1;
    },
  },
  mounted() {
    this.$watch(
      () => store.getters['layout/styles'],
      () => this.updatePositions(),
      { immediate: true },
    );
  },
};
</script>


<style lang="scss">
@import '../styles/variables.scss';

.tour {
  position: absolute;
  top: 0;
  left: 0;
}

.tour-step {
  position: absolute;
}

$tour-step-background: transparentize(mix(#f3f3f3, $selection-highlighting-color, 75%), 0.025);
$tour-step-width: 240px;

.tour-step__inner {
  position: absolute;
  background-color: $tour-step-background;
  padding: 1.5em;
  font-size: 0.9em;
  line-height: 1.33;
  width: $tour-step-width;
  text-align: center;
  border-radius: $border-radius-base;

  h2 {
    margin: 0;

    &::after {
      display: none;
    }
  }

  .icon,
  .icon-provider {
    width: 1.25em;
    height: 1.25em;
    vertical-align: bottom;
    display: inline-block;
  }

  &::before {
    content: '';
    position: absolute;
  }

  .tour-step--welcome &,
  .tour-step--end & {
    left: -$tour-step-width/2;
    top: 36px;
    border-bottom-right-radius: 0;

    &::before {
      bottom: -10px;
      right: 0;
      border-top: 10px solid $tour-step-background;
      border-left: 10px solid transparent;
    }
  }

  .tour-step--editor &,
  .tour-step--menu & {
    right: 15px;
    border-top-right-radius: 0;

    &::before {
      top: 0;
      right: -10px;
      border-top: 10px solid $tour-step-background;
      border-right: 10px solid transparent;
    }
  }

  .tour-step--explorer & {
    left: 15px;
    border-top-left-radius: 0;

    &::before {
      top: 0;
      left: -10px;
      border-top: 10px solid $tour-step-background;
      border-left: 10px solid transparent;
    }
  }
}

.tour-step__button-bar {
  margin-top: 1.5em;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  .button {
    font-size: 1.1em;
  }
}
</style>
