# 변경 이력 (CHANGELOG)

**iM Markdown** 프로젝트의 주요 변경 사항 기록입니다.

---

## [v5.15.4-iM] - 2026-03-10

### 🚀 브랜드 및 환경 최적화 (Rebranding & Optimization)
* **브랜드 변경**: 기존 StackEdit 명칭을 **iM Markdown**으로 변경.
* **사내/폐쇄망 독립 동작 지원**:
  * 외부 서비스 연동(Google Drive, Dropbox, Blogger, WordPress 등) 및 출판/동기화/후원 기능 제거/비활성화.
  * 외부 네트워크 연결 없이 사용자의 브라우저 내 저장소(IndexedDB / LocalStorage) 기반으로 동작하도록 오프라인 퍼스트 환경 구축.

### 🎨 UI 및 디자인 표준화 (UI & Typography Standards)
* **폰트 표준 적용**:
  * 글로벌 UI 및 메뉴 폰트로 `Pretendard` 지정.
  * 코드 영역 및 에디터 폰트로 `Cascadia Code` 지정.
* **서브픽셀 라스터라이제이션 번짐 방지**:
  * SCSS 및 CSS 내 폰트 크기와 레이아웃 치수를 정수 픽셀(px) 및 16px 기준 em 단위(0.875em, 0.8125em 등)로 구성.

### 📝 문서 및 LLM 파악 지원 (Documentation & LLM Readiness)
* **README.md 재작성**:
  * 왜곡된 외부 링크 및 스택에디트 생태계 정보 제거.
  * 사내망 특성, 기술 스택(Vue 2, Node v10), 빌드/테스트/배포 가이드, LLM 및 에이전트(JULES)용 개발 지침 명시.
* **사용자 문서 현행화**:
  * `welcomeFile.md` 및 `faq.md` 내용을 오프라인 저장, 파일 관리 및 Markdown 확장기능(KaTeX, Mermaid) 중심으로 정돈.
* **CHANGELOG.md 생성**: 프로젝트 변경 내역 추적 문서 신규 작성.
