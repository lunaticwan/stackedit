# StackEdit

[![Build Status](https://img.shields.io/travis/benweet/stackedit.svg?style=flat)](https://travis-ci.org/benweet/stackedit) [![NPM version](https://img.shields.io/npm/v/stackedit.svg?style=flat)](https://www.npmjs.org/package/stackedit)

> Stack Overflow 및 Stack Exchange 사이트에서 사용되는 Markdown 라이브러리인 PageDown 기반의 풀기능 오픈소스 Markdown 에디터입니다.

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

### Helm을 이용한 배포 (Deploy with Helm)

StackEdit Helm 차트를 사용하면 Kubernetes 클러스터에 StackEdit을 쉽게 배포할 수 있습니다.
기존 Ingress 컨트롤러 및 cert-manager와 함께 배포하도록 설정할 수 있습니다.

```bash
# StackEdit Helm 리포지토리 추가
helm repo add stackedit https://benweet.github.io/stackedit-charts/

# 로컬 Helm 차트 리포지토리 캐시 업데이트
helm repo update

# 클러스터에 StackEdit 차트 배포
helm install --name stackedit stackedit/stackedit \
  --set dropboxAppKey=$DROPBOX_API_KEY \
  --set dropboxAppKeyFull=$DROPBOX_FULL_ACCESS_API_KEY \
  --set googleClientId=$GOOGLE_CLIENT_ID \
  --set googleApiKey=$GOOGLE_API_KEY \
  --set githubClientId=$GITHUB_CLIENT_ID \
  --set githubClientSecret=$GITHUB_CLIENT_SECRET \
  --set wordpressClientId=\"$WORDPRESS_CLIENT_ID\" \
  --set wordpressSecret=$WORDPRESS_CLIENT_SECRET
```

이후 StackEdit을 최신 버전으로 업그레이드하려면:

```bash
helm repo update
helm upgrade stackedit stackedit/stackedit
```

StackEdit을 삭제하려면:

```bash
helm delete --purge stackedit
```

기존 Ingress 컨트롤러 및 cert-manager issuer를 사용하려는 경우:

```bash
# 참고: https://docs.cert-manager.io/en/latest/tutorials/acme/quick-start/index.html
helm install --name stackedit stackedit/stackedit \
  --set dropboxAppKey=$DROPBOX_API_KEY \
  --set dropboxAppKeyFull=$DROPBOX_FULL_ACCESS_API_KEY \
  --set googleClientId=$GOOGLE_CLIENT_ID \
  --set googleApiKey=$GOOGLE_API_KEY \
  --set githubClientId=$GITHUB_CLIENT_ID \
  --set githubClientSecret=$GITHUB_CLIENT_SECRET \
  --set wordpressClientId=\"$WORDPRESS_CLIENT_ID\" \
  --set wordpressSecret=$WORDPRESS_CLIENT_SECRET \
  --set ingress.enabled=true \
  --set ingress.annotations."kubernetes\.io/ingress\.class"=nginx \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod \
  --set ingress.hosts[0].host=stackedit.example.com \
  --set ingress.hosts[0].paths[0]=/ \
  --set ingress.tls[0].secretName=stackedit-tls \
  --set ingress.tls[0].hosts[0]=stackedit.example.com
```
