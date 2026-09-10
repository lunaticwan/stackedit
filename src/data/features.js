class Feature {
  constructor(id, badgeName, description, children = null) {
    this.id = id;
    this.badgeName = badgeName;
    this.description = description;
    this.children = children;
  }

  toBadge(badgeCreations) {
    const children = this.children
      ? this.children.map(child => child.toBadge(badgeCreations))
      : null;
    return {
      featureId: this.id,
      name: this.badgeName,
      description: this.description,
      children,
      isEarned: children
        ? children.every(child => child.isEarned)
        : !!badgeCreations[this.id],
      hasSomeEarned: children && children.some(child => child.isEarned),
    };
  }
}

export default [
  new Feature(
    'navigationBar',
    '네비게이션 바 전문가',
    '네비게이션 바를 사용하여 Markdown 서식을 변경하고 현재 파일의 이름을 변경하세요.',
    [
      new Feature(
        'formatButtons',
        '서식 지정자',
        '서식 버튼을 사용하여 Markdown 파일의 서식을 변경하세요.',
      ),
      new Feature(
        'editCurrentFileName',
        '이름 변경자',
        '네비게이션 바의 이름 필드를 사용하여 현재 파일 이름을 변경하세요.',
      ),
      new Feature(
        'toggleExplorer',
        '탐색기 토글러',
        '네비게이션 바를 사용하여 탐색기를 토글하세요.',
      ),
      new Feature(
        'toggleSideBar',
        '사이드바 토글러',
        '네비게이션 바를 사용하여 사이드바를 토글하세요.',
      ),
    ],
  ),
  new Feature(
    'explorer',
    '탐색기 전문가',
    '파일 탐색기를 사용하여 Workspace의 파일과 폴더를 관리하세요.',
    [
      new Feature(
        'createFile',
        '파일 생성자',
        '파일 탐색기를 사용하여 Workspace에 새 파일을 생성하세요.',
      ),
      new Feature(
        'switchFile',
        '파일 전환자',
        '파일 탐색기를 사용하여 Workspace 내 파일 간 전환을 수행하세요.',
      ),
      new Feature(
        'createFolder',
        '폴더 생성자',
        '파일 탐색기를 사용하여 Workspace에 새 폴더를 생성하세요.',
      ),
      new Feature(
        'moveFile',
        '파일 이동자',
        '파일 탐색기에서 파일을 끌어서 다른 폴더로 이동하세요.',
      ),
      new Feature(
        'moveFolder',
        '폴더 이동자',
        '파일 탐색기에서 폴더를 끌어서 다른 폴더로 이동하세요.',
      ),
      new Feature(
        'renameFile',
        '파일 이름 변경자',
        '파일 탐색기를 사용하여 Workspace의 파일 이름을 변경하세요.',
      ),
      new Feature(
        'renameFolder',
        '폴더 이름 변경자',
        '파일 탐색기를 사용하여 Workspace의 폴더 이름을 변경하세요.',
      ),
      new Feature(
        'removeFile',
        '파일 삭제자',
        '파일 탐색기를 사용하여 Workspace의 파일을 삭제하세요.',
      ),
      new Feature(
        'removeFolder',
        '폴더 삭제자',
        '파일 탐색기를 사용하여 Workspace의 폴더를 삭제하세요.',
      ),
    ],
  ),
  new Feature(
    'buttonBar',
    '버튼 바 전문가',
    '버튼 바를 사용하여 에디터 레이아웃을 설정하고 기능을 토글하세요.',
    [
      new Feature(
        'toggleNavigationBar',
        '네비게이션 바 토글러',
        '버튼 바를 사용하여 네비게이션 바를 토글하세요.',
      ),
      new Feature(
        'toggleSidePreview',
        '사이드 미리보기 토글러',
        '버튼 바를 사용하여 사이드 미리보기를 토글하세요.',
      ),
      new Feature(
        'toggleEditor',
        '에디터 토글러',
        '버튼 바를 사용하여 에디터를 토글하세요.',
      ),
      new Feature(
        'toggleFocusMode',
        '집중 모드',
        '버튼 바를 사용하여 집중 모드를 토글하세요. 입력 시 커서 위치를 화면 중앙에 유지합니다.',
      ),
      new Feature(
        'toggleScrollSync',
        '스크롤 동기화 토글러',
        '버튼 바를 사용하여 스크롤 동기화를 토글하세요. 에디터와 미리보기의 스크롤바가 연동됩니다.',
      ),
      new Feature(
        'toggleStatusBar',
        '상태 바 토글러',
        '버튼 바를 사용하여 상태 바를 토글하세요.',
      ),
    ],
  ),
  new Feature(
    'workspaces',
    'Workspace 전문가',
    'Workspace 메뉴를 사용하여 다양한 Workspace를 생성하고 관리하세요.',
    [
      new Feature(
        'renameWorkspace',
        'Workspace 이름 변경자',
        'Workspace 관리 대화상자를 사용하여 Workspace 이름을 변경하세요.',
      ),
      new Feature(
        'removeWorkspace',
        'Workspace 삭제자',
        'Workspace 관리 대화상자를 사용하여 로컬 Workspace를 삭제하세요.',
      ),
    ],
  ),
  new Feature(
    'manageHistory',
    '역사가',
    '파일 히스토리 메뉴를 사용하여 버전 이력을 확인하고 이전 버전으로 복원하세요.',
    [
      new Feature(
        'restoreVersion',
        '복원자',
        '파일 히스토리 메뉴를 사용하여 현재 파일의 이전 버전을 복원하세요.',
      ),
    ],
  ),
  new Feature(
    'manageProperties',
    '속성 전문가',
    '파일 속성 대화상자를 사용하여 현재 파일의 속성을 변경하세요.',
    [
      new Feature(
        'setMetadata',
        '메타데이터 설정자',
        '파일 속성 대화상자를 사용하여 현재 파일의 메타데이터를 설정하세요.',
      ),
      new Feature(
        'changePreset',
        '프리셋 변경자',
        '파일 속성 대화상자를 사용하여 Markdown 엔진 프리셋을 변경하세요.',
      ),
      new Feature(
        'changeExtension',
        '확장 기능 전문가',
        '파일 속성 대화상자를 사용하여 Markdown 엔진 확장 기능을 설정하세요.',
      ),
    ],
  ),
  new Feature(
    'comment',
    '댓글 전문가',
    '토론을 시작 및 삭제하고, 댓글을 추가 및 삭제하세요.',
    [
      new Feature(
        'createDiscussion',
        '토론 시작자',
        '댓글 버튼을 사용하여 새 토론을 시작하세요.',
      ),
      new Feature(
        'addComment',
        '댓글 작성자',
        '토론 가터를 사용하여 기존 토론에 댓글을 작성하세요.',
      ),
      new Feature(
        'removeComment',
        '중재자',
        '토론 가터를 사용하여 토론 내 댓글을 삭제하세요.',
      ),
      new Feature(
        'removeDiscussion',
        '토론 종결자',
        '토론 가터를 사용하여 토론을 삭제하세요.',
      ),
    ],
  ),
  new Feature(
    'importExport',
    '가져오기/내보내기',
    '가져오기/내보내기 메뉴를 사용하여 파일을 가져오고 내보내세요.',
    [
      new Feature(
        'importMarkdown',
        'Markdown 가져오기',
        '가져오기/내보내기 메뉴를 사용하여 디스크에서 Markdown 파일을 가져오세요.',
      ),
      new Feature(
        'exportMarkdown',
        'Markdown 내보내기',
        '가져오기/내보내기 메뉴를 사용하여 디스크로 Markdown 파일을 내보내세요.',
      ),
      new Feature(
        'importHtml',
        'HTML 가져오기',
        '가져오기/내보내기 메뉴를 사용하여 디스크에서 HTML 파일을 가져와 Markdown으로 변환하세요.',
      ),
      new Feature(
        'exportHtml',
        'HTML 내보내기',
        '가져오기/내보내기 메뉴를 사용하여 Handlebars 템플릿 기반 HTML 파일로 내보내세요.',
      ),
      new Feature(
        'exportPdf',
        'PDF 내보내기',
        '가져오기/내보내기 메뉴를 사용하여 디스크에 PDF 파일로 내보내세요.',
      ),
      new Feature(
        'exportPandoc',
        'Pandoc 내보내기',
        '가져오기/내보내기 메뉴를 사용하여 Pandoc을 통해 파일로 내보내세요.',
      ),
    ],
  ),
  new Feature(
    'manageSettings',
    '설정 전문가',
    '설정 대화상자를 사용하여 애플리케이션 동작 및 단축키를 설정하세요.',
    [
      new Feature(
        'changeSettings',
        '설정 변경자',
        '설정 대화상자를 사용하여 애플리케이션 동작을 조정하세요.',
      ),
      new Feature(
        'changeShortcuts',
        '단축키 에디터',
        '설정 대화상자를 사용하여 단축키를 변경하세요.',
      ),
    ],
  ),
  new Feature(
    'manageTemplates',
    '템플릿 전문가',
    '템플릿 대화상자를 사용하여 Handlebars 템플릿을 생성, 삭제, 수정하세요.',
    [
      new Feature(
        'addTemplate',
        '템플릿 생성자',
        '템플릿 대화상자를 사용하여 Handlebars 템플릿을 생성하세요.',
      ),
      new Feature(
        'removeTemplate',
        '템플릿 삭제자',
        '템플릿 대화상자를 사용하여 Handlebars 템플릿을 삭제하세요.',
      ),
    ],
  ),
];
