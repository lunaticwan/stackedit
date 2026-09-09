<template>
  <modal-inner aria-label="Blogger Page에 게시">
    <div class="modal__content">
      <div class="modal__image">
        <icon-provider provider-id="bloggerPage"></icon-provider>
      </div>
      <p><b>{{currentFileName}}</b>을(를) <b>Blogger Page</b>에 게시합니다.</p>
      <form-entry label="블로그 URL" error="blogUrl">
        <input slot="field" class="textfield" type="text" v-model.trim="blogUrl" @keydown.enter="resolve()">
        <div class="form-entry__info">
          <b>예시:</b> http://example.blogger.com/
        </div>
      </form-entry>
      <form-entry label="기존 페이지 ID" info="선택 사항">
        <input slot="field" class="textfield" type="text" v-model.trim="pageId" @keydown.enter="resolve()">
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
      <div class="modal__info">
        <b>팁:</b> <a href="javascript:void(0)" @click="openFileProperties">파일 속성</a>에서 <code>title</code> 값을 지정할 수 있습니다.
      </div>
    </div>
    <div class="modal__button-bar">
      <button class="button" @click="config.reject()">취소</button>
      <button class="button button--resolve" @click="resolve()">확인</button>
    </div>
  </modal-inner>
</template>

<script>
import bloggerPageProvider from '../../../services/providers/bloggerPageProvider';
import modalTemplate from '../common/modalTemplate';

export default modalTemplate({
  data: () => ({
    pageId: '',
  }),
  computedLocalSettings: {
    blogUrl: 'bloggerBlogUrl',
    selectedTemplate: 'bloggerPublishTemplate',
  },
  methods: {
    resolve() {
      if (!this.blogUrl) {
        this.setError('blogUrl');
      } else {
        // Return new location
        const location = bloggerPageProvider.makeLocation(
          this.config.token,
          this.blogUrl,
          this.pageId,
        );
        location.templateId = this.selectedTemplate;
        this.config.resolve(location);
      }
    },
  },
});
</script>
