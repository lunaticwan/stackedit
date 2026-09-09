# iM Markdown

> PageDown 기반의 풀기능 마크다운 에디터 iM Markdown입니다.

https://stackedit.io/

### 생태계 (Ecosystem)

- [Chrome 앱](https://chrome.google.com/webstore/detail/iiooodelglhkcpgbajoejffhijaclcdg)
- [stackedit.js](https://github.com/benweet/stackedit.js)를 사용하여 모든 웹사이트에 StackEdit 임베드 가능
- stackedit.js를 사용하는 [Chrome 확장 프로그램](https://chrome.google.com/webstore/detail/ajehldoplanpchfokmeempkekhnhmoha)
- [커뮤니티](https://community.stackedit.io/)

### 빌드 및 실행 (Build)

```bash
# 의존성 패키지 설치
npm install

# 로컬 개발 서버 실행 (localhost:8080)
npm start

# 프로덕션 빌드 (파일 압축 및 최적화)
npm run build

# 프로덕션 빌드 및 번들 분석 보고서 확인
npm run build --report
```

### GitHub Pages 배포 (GitHub Pages Deployment)

이 리포지토리는 GitHub Actions를 사용하여 GitHub Pages에 자동 배포되도록 설정되어 있습니다.

- `.github/workflows/deploy.yml` 워크플로우 파일이 포함되어 있습니다.
- `main` 또는 `master` 브랜치에 변경 사항이 push되면 자동으로 Node.js v10 환경에서 빌드가 수행되고, 결과물(`dist/`)이 GitHub Pages에 배포됩니다.
- GitHub 리포지토리 설정의 **Settings > Pages > Build and deployment**에서 Source를 **GitHub Actions**로 지정해야 합니다.

