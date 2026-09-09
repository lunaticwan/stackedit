<template>
  <modal-inner aria-label="Publish to Google Drive">
    <div class="modal__content">
      <div class="modal__image">
        <icon-provider provider-id="googleDrive"></icon-provider>
      </div>
      <p>Publish <b>{{currentFileName}}</b> to your <b>Google Drive</b> account.</p>
      <form-entry label="폴더 ID" info="선택 사항">
        <input slot="field" class="textfield" type="text" v-model.trim="folderId" @keydown.enter="resolve()">
        <div class="form-entry__info">
          If not supplied, the file will be created in your Drive root folder.
        </div>
        <div class="form-entry__actions">
          <a href="javascript:void(0)" @click="openFolder">Choose folder</a>
        </div>
      </form-entry>
      <form-entry label="기존 파일 ID" info="선택 사항">
        <input slot="field" class="textfield" type="text" v-model.trim="fileId" @keydown.enter="resolve()">
        <div class="form-entry__info">
          This will overwrite the file on the server.
        </div>
      </form-entry>
      <div class="form-entry">
        <div class="form-entry__radio">
          <label>
            <input type="radio" v-model="format" value="markdown"> Export Markdown
          </label>
        </div>
        <div class="form-entry__radio">
          <label>
            <input type="radio" v-model="format" value="html"> Export HTML
          </label>
        </div>
      </div>
      <form-entry label="템플릿" v-if="format === 'html'">
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
        <b>ProTip:</b> You can provide a value for <code>title</code> in the <a href="javascript:void(0)" @click="openFileProperties">file properties</a>.
      </div>
    </div>
    <div class="modal__button-bar">
      <button class="button" @click="config.reject()">취소</button>
      <button class="button button--resolve" @click="resolve()">확인</button>
    </div>
  </modal-inner>
</template>

<script>
import googleHelper from '../../../services/providers/helpers/googleHelper';
import googleDriveProvider from '../../../services/providers/googleDriveProvider';
import modalTemplate from '../common/modalTemplate';
import store from '../../../store';

export default modalTemplate({
  data: () => ({
    fileId: '',
  }),
  computedLocalSettings: {
    folderId: 'googleDriveFolderId',
    selectedTemplate: 'googleDrivePublishTemplate',
    format: 'googleDrivePublishFormat',
  },
  methods: {
    openFolder() {
      return store.dispatch(
        'modal/hideUntil',
        googleHelper.openPicker(this.config.token, 'folder')
          .then((folders) => {
            if (folders[0]) {
              store.dispatch('data/patchLocalSettings', {
                googleDriveFolderId: folders[0].id,
              });
            }
          }),
      );
    },
    resolve() {
      // Return new location
      const location = googleDriveProvider.makeLocation(this.config.token, this.fileId);
      if (this.format === 'html') {
        location.templateId = this.selectedTemplate;
      }
      this.config.resolve(location);
    },
  },
});
</script>
