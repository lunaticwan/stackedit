<template>
  <div class="stat-panel panel no-overflow">
    <div class="stat-panel__block stat-panel__block--left" v-if="styles.showEditor">
      <span class="stat-panel__block-name">
        Markdown
        <span v-if="textSelection">(선택 영역)</span>
      </span>
      <span v-for="stat in textStats" :key="stat.id">
        <span class="stat-panel__value">{{stat.value}}</span> {{stat.name}}
      </span>
      <span class="stat-panel__value" v-title="'추정된 LLM 토큰 수 (영문/한글 혼합 기준)'">~{{estimatedTokens}} 토큰</span>
      <span class="stat-panel__value">{{line}}행, {{column}}열</span>
      <button
        class="stat-panel__llm-btn"
        @click="copyForLLM"
        v-title="'LLM 프롬프트 서식으로 마크다운 복사'"
      >
        <span v-if="copied">복사됨!</span>
        <span v-else>LLM 복사</span>
      </button>
    </div>
    <div class="stat-panel__block stat-panel__block--right">
      <span class="stat-panel__block-name">
        HTML
        <span v-if="htmlSelection">(선택 영역)</span>
      </span>
      <span v-for="stat in htmlStats" :key="stat.id">
        <span class="stat-panel__value">{{stat.value}}</span> {{stat.name}}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import editorSvc from '../services/editorSvc';
import utils from '../services/utils';

class Stat {
  constructor(name, regex) {
    this.id = utils.uid();
    this.name = name;
    this.regex = new RegExp(regex, 'gm');
    this.value = null;
  }
}

export default {
  data: () => ({
    textSelection: false,
    htmlSelection: false,
    line: 0,
    column: 0,
    estimatedTokens: 0,
    copied: false,
    textStats: [
      new Stat('바이트', '[\\s\\S]'),
      new Stat('단어', '\\S+'),
      new Stat('줄', '\n'),
    ],
    htmlStats: [
      new Stat('글자', '\\S'),
      new Stat('단어', '\\S+'),
      new Stat('단락', '\\S.*'),
    ],
  }),
  computed: mapGetters('layout', [
    'styles',
  ]),
  created() {
    this.computeTextRaf = null;
    this.computeHtmlRaf = null;

    editorSvc.$on('sectionList', () => this.scheduleComputeText());
    editorSvc.$on('selectionRange', () => this.scheduleComputeText());
    editorSvc.$on('previewCtx', () => this.scheduleComputeHtml());
    editorSvc.$on('previewSelectionRange', () => this.scheduleComputeHtml());
  },
  destroyed() {
    if (this.computeTextRaf) cancelAnimationFrame(this.computeTextRaf);
    if (this.computeHtmlRaf) cancelAnimationFrame(this.computeHtmlRaf);
  },

  methods: {
    scheduleComputeText() {
      if (this.computeTextRaf) {
        cancelAnimationFrame(this.computeTextRaf);
      }
      this.computeTextRaf = requestAnimationFrame(() => this.computeText());
    },
    scheduleComputeHtml() {
      if (this.computeHtmlRaf) {
        cancelAnimationFrame(this.computeHtmlRaf);
      }
      this.computeHtmlRaf = requestAnimationFrame(() => this.computeHtml());
    },
    computeText() {
      this.textSelection = false;
      let text = editorSvc.clEditor ? editorSvc.clEditor.getContent() : '';
      if (editorSvc.clEditor && editorSvc.clEditor.selectionMgr) {
        const beforeText = text.slice(0, editorSvc.clEditor.selectionMgr.selectionEnd);
        const beforeLines = beforeText.split('\n');
        this.line = beforeLines.length;
        this.column = beforeLines.pop().length;

        const selectedText = editorSvc.clEditor.selectionMgr.getSelectedText();
        if (selectedText) {
          this.textSelection = true;
          text = selectedText;
        }
      }

      this.textStats.forEach((stat) => {
        stat.value = (text.match(stat.regex) || []).length;
      });

      // Compute LLM token estimation (bpe heuristic: ~4 chars for ASCII, ~1.5 chars for Non-ASCII)
      let nonAsciiCount = 0;
      let asciiCount = 0;
      for (let i = 0; i < text.length; i += 1) {
        if (text.charCodeAt(i) > 127) {
          nonAsciiCount += 1;
        } else {
          asciiCount += 1;
        }
      }
      this.estimatedTokens = Math.ceil((asciiCount / 4) + (nonAsciiCount / 1.5));
    },
    computeHtml() {
      let text;
      if (editorSvc.previewSelectionRange) {
        text = `${editorSvc.previewSelectionRange}`;
      }
      this.htmlSelection = true;
      if (!text) {
        this.htmlSelection = false;
        if (editorSvc.previewCtx) {
          ({ text } = editorSvc.previewCtx);
        }
      }
      if (text != null) {
        this.htmlStats.forEach((stat) => {
          stat.value = (text.match(stat.regex) || []).length;
        });
      }
    },
    copyForLLM() {
      let text = editorSvc.clEditor ? editorSvc.clEditor.getContent() : '';
      if (editorSvc.clEditor && editorSvc.clEditor.selectionMgr) {
        const selectedText = editorSvc.clEditor.selectionMgr.getSelectedText();
        if (selectedText) {
          text = selectedText;
        }
      }
      const formattedPrompt = `\`\`\`markdown\n${text}\n\`\`\``;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formattedPrompt);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = formattedPrompt;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    },
  },
};
</script>

<style lang="scss">
.stat-panel {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 12px;
}

.stat-panel__block {
  margin: 0 10px;
}

.stat-panel__block--left {
  float: left;
}

.stat-panel__block--right {
  float: right;
}

.stat-panel__value {
  font-weight: 600;
  margin-left: 5px;
}

.stat-panel__llm-btn {
  margin-left: 8px;
  padding: 1px 6px;
  font-size: 11px;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.35);
  }
}
</style>
