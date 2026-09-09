const simpleModal = (contentHtml, rejectText, resolveText) => ({
  contentHtml: typeof contentHtml === 'function' ? contentHtml : () => contentHtml,
  rejectText,
  resolveText,
});

/* eslint sort-keys: "error" */
export default {
  commentDeletion: simpleModal(
    '<p>댓글을 삭제하시겠습니까?</p>',
    '아니오',
    '예, 삭제합니다',
  ),
  discussionDeletion: simpleModal(
    '<p>토론을 삭제하시겠습니까?</p>',
    '아니오',
    '예, 삭제합니다',
  ),
  fileRestoration: simpleModal(
    '<p>변경 사항을 되돌리시겠습니까?</p>',
    '아니오',
    '예, 복원합니다',
  ),
  folderDeletion: simpleModal(
    config => `<p>폴더 <b>${config.item.name}</b>을(를) 삭제하시겠습니까? 포함된 파일은 휴지통으로 이동합니다.</p>`,
    '아니오',
    '예, 삭제합니다',
  ),
  pathConflict: simpleModal(
    config => `<p><b>${config.item.name}</b>이(가) 이미 존재합니다. 접미사를 추가하시겠습니까?</p>`,
    '아니오',
    '예, 접미사 추가',
  ),
  providerRedirection: simpleModal(
    config => `<p><b>${config.name}</b> 인증 페이지로 이동합니다.</p>`,
    '취소',
    '확인, 이동합니다',
  ),
  removeWorkspace: simpleModal(
    '<p>로컬 Workspace를 제거하시겠습니까?</p>',
    '아니오',
    '예, 제거합니다',
  ),
  reset: simpleModal(
    '<p>모든 로컬 Workspace 데이터가 초기화됩니다. 계속하시겠습니까?</p>',
    '아니오',
    '예, 초기화합니다',
  ),
  signInForComment: simpleModal(
    `<p>댓글을 작성하려면 Google 계정으로 로그인해야 합니다.</p>
    <div class="modal__info"><b>참고:</b> 로그인 시 메인 Workspace가 동기화됩니다.</div>`,
    '취소',
    '확인, 로그인',
  ),
  stripName: simpleModal(
    config => `<p><b>${config.item.name}</b>에 허용되지 않는 문자가 포함되어 있습니다. 제거하시겠습니까?</p>`,
    '아니오',
    '예, 제거',
  ),
  tempFileDeletion: simpleModal(
    config => `<p>임시 파일 <b>${config.item.name}</b>을(를) 영구 삭제하시겠습니까?</p>`,
    '아니오',
    '예, 삭제',
  ),
  tempFolderDeletion: simpleModal(
    '<p>모든 임시 파일을 영구 삭제하시겠습니까?</p>',
    '아니오',
    '예, 전체 삭제',
  ),
  trashDeletion: simpleModal(
    '<p>휴지통의 파일은 7일 동안 활동이 없으면 자동으로 삭제됩니다.</p>',
    '확인',
  ),
  unauthorizedName: simpleModal(
    config => `<p><b>${config.item.name}</b>은(는) 사용할 수 없는 이름입니다.</p>`,
    '확인',
  ),
  workspaceGoogleRedirection: simpleModal(
    '<p>이 Workspace를 열려면 iM Markdown에 Google Drive 전체 접근 권한이 필요합니다.</p>',
    '취소',
    '확인, 권한 부여',
  ),
};
