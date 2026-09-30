# iM Markdown

> PageDown 및 Vue 2 기반의 사내/폐쇄망 환경 맞춤형 마크다운 에디터 **iM Markdown**입니다.

---

## 📌 프로젝트 개요 (Overview)

**iM Markdown**은 웹 브라우저 환경에서 동작하는 웹 기반 마크다운 에디터입니다.
사내망 및 폐쇄망(Internal Network) 환경에 최적화되어 있으며, 외부 서버 연동 없이 사용자의 브라우저 내 IndexedDB / LocalStorage를 활용하여 문서를 안전하게 관리합니다.

* **독립성 (Offline-first)**: 외부 동기화, 출판, 외부 서비스 연동(Blogger, Google Drive 등) 및 외부 링크가 제거/비활성화되어 보안 및 내부 네트워크 환경에 최적화되어 있습니다.
* **디자인 & 폰트 표준**: UI 및 메뉴에는 `Pretendard`, 코드 영역에는 `Cascadia Code` 폰트를 최우선 적용합니다. 서브픽셀 라스터라이제이션 번짐 방지를 위해 정수 픽셀 단위 및 16px 기준 em 단위를 준수합니다.

---

## 🛠 기술 스택 & 런타임 (Tech Stack & Runtime)

* **Framework**: Vue 2 (Vuex, Vue Router)
* **Markdown Engine**: PageDown, Markdown-it, KaTeX, Mermaid
* **Font**: Pretendard (UI), Cascadia Code (Code)
* **Runtime**: Node.js **v10** (네이티브 모듈 및 레거시 빌드 의존성 호환을 위해 반드시 Node.js v10 사용)

---

## 📁 프로젝트 아키텍처 (Directory Structure)

```text
iM-Markdown/
├── build/                 # Webpack 빌드 설정 파일
├── config/                # 환경 변수 및 빌드 환경 설정
├── src/
│   ├── components/        # Vue 컴포넌트 (에디터, 탐색기, 모달 등)
│   ├── services/          # 저장소, 마크다운 렌더링, 수식 및 다이어그램 처리 서비스
│   ├── data/              # 초기 웰컴 파일, FAQ, 샘플 마크다운 데이터
│   ├── store/             # Vuex 상태 관리
│   └── styles/            # SCSS/CSS 스타일시트 및 폰트 설정
├── test/                  # ESLint 및 Jest 단위 테스트
├── static/                # 정적 리소스 파일
├── .github/workflows/     # GitHub Actions 배포 워크플로우 (deploy.yml)
└── README.md              # 프로젝트 안내 문서
```

---

## 🚀 빌드 및 실행 (Build & Run)

### 1. 사전 요구사항 (Prerequisites)
Node.js v10 환경이 필요합니다. `nvm`을 활용하여 버전을 맞춰줍니다.

```bash
nvm use 10
```

### 2. 의존성 설치 (Installation)

```bash
npm install
```

### 3. 로컬 개발 서버 실행 (Development)

```bash
npm start
# 실행 후 http://localhost:8080 접속
```

### 4. 테스트 실행 (Testing)

```bash
npm test
# ESLint 검사(npm run lint) 및 Jest 단위 테스트(npm run unit) 함께 수행
```

### 5. 프로덕션 빌드 (Production Build)

```bash
npm run build
# 빌드 완료 시 dist/ 디렉토리에 최적화된 정적 자산이 생성됨
```

---

## 🚢 배포 (Deployment)

본 프로젝트는 GitHub Actions (`.github/workflows/deploy.yml`)를 통해 GitHub Pages에 자동 배포되도록 구성되어 있습니다.
* `main` 또는 `master` 브랜치에 변경 사항 push 시, Node.js v10 환경에서 자동 빌드 수행 후 `dist/` 파이프라인 출력이 배포됩니다.
* 별도의 Nginx 및 서버 설정 없이 생성된 `dist/` 정적 자산을 웹 서버에 서빙하여 사용할 수 있습니다.

---

## 🤖 LLM & 에이전트 개발 지침 (Guidelines for LLM / JULES)

1. **언어 및 표현**:
   - 주석, UI 텍스트, 설명 문서 작성 시 한국어(Korean)를 기본으로 하며, 존댓말을 배제하고 단정형/개조식 어미(`~함`, `~기`, `~금지`, `~필수`)를 사용합니다.
   - 코드 및 기술 고유명사(변수명, CLI 명령어, 라이브러리명 등)는 원형을 유지합니다.
2. **스타일 & 레이아웃**:
   - 폰트 크기 및 레이아웃 치수 수정 시 서브픽셀 번짐을 방지하기 위해 정수 픽셀 및 16 베이스 em 값(0.875em=14px, 0.8125em=13px 등)을 사용합니다.
3. **코드 주석 표준**:
   - 비즈니스 의도만 간결하게 설명하며, AI 지시 흔적(`[1단계]`, `[Rule 5.2]` 등)을 기재하지 않습니다.

---

## 📄 라이선스 (License)

본 프로젝트는 [Apache License 2.0](LICENSE) 라이선스 하에 배포됩니다.

### 주요 오픈소스 라이선스 준수 (Open Source Licenses)
**iM Markdown**은 다음의 주요 오픈소스 라이브러리를 활용하여 개발되었으며, 각 오픈소스의 라이선스를 준수합니다.

* **StackEdit** ([Apache-2.0](https://github.com/benweet/stackedit)): 베이스 웹 마크다운 에디터 프레임워크
* **Vue.js & Vuex** ([MIT](https://github.com/vuejs/vue)): UI 컴포넌트 프레임워크 및 상태 관리
* **Markdown-it** ([MIT](https://github.com/markdown-it/markdown-it)): 마크다운 파싱 및 HTML 변환 엔진
* **KaTeX** ([MIT](https://github.com/KaTeX/KaTeX)): 수식 렌더링 라이브러리
* **Mermaid** ([MIT](https://github.com/mermaid-js/mermaid)): 다이어그램 및 차트 생성 라이브러리
* **Prism.js** ([MIT](https://github.com/PrismJS/prism)): 코드 구문 하이라이팅 라이브러리 (`gulpfile.js` 빌드 스크립트를 통해 커스텀 번들링 적용)
* **ClEdit / PageDown** ([Apache-2.0](https://github.com/benweet/stackedit)): 에디터 코어 입력 처리 및 하이라이팅 엔진 (`src/services/editor/cledit/` 경로에서 커스터마이징하여 사용)
* **Turndown** ([MIT](https://github.com/mixmark-io/turndown)): HTML to Markdown 변환 라이브러리
