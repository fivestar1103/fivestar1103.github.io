# Permanent github.io compatibility host

새 공개 `fivestar1103.github.io` 저장소에 **이 디렉터리의 새 파일만** 넣는다. 과거 저장소 이력은 가져오지 않는다. Pages 소스는 `main:/docs`, custom domain은 비워 두며 `CNAME`을 만들지 않는다. `.nojekyll`을 유지한다.

- `docs/subtitle-overlay/models/silero_vad.onnx`: 설치된 Subtitle Overlay ≤1.8.0용 영구 URL. 200 / 2,327,524 bytes / SHA-256 `2623a2953f6ff3d2c1e61740c6cdb7168133479b267dfef114a4a3cc5bdd788f`. 이름/내용/경로 변경 금지. Pages의 CORS `*`는 배포 후 확인한다.
- `docs/app-ads.txt`: 기존 스토어 개발자 도메인을 읽는 AdMob 크롤러는 JS 리디렉션을 실행하지 않으므로 원본 유지. 본 사이트와 함께 갱신한다.
- `docs/threads-oauth/{callback,deauthorize,delete}/index.html`: 등록된 OAuth URI 및 콜백 경로가 확실하지 않아 원본 3개 유지. callback은 code/state를 다른 호스트로 전달하지 않는다. deauthorize/delete는 기존 정적 안내문일 뿐 POST 검증/서명 처리 기능은 없다. Meta 콘솔 확인은 소유자 작업이다.
- `docs/robots.txt`: 크롤러가 페이지의 noindex를 읽을 수 있도록 Allow. 일반 페이지는 index/404의 noindex; 기계용 파일은 차단하지 않는다.
- `docs/index.html`, `docs/404.html`: JS 사용 브라우저는 고정 https://kuiperbelt.site origin에 path/query/hash 그대로 이동. 404의 원래 HTTP 상태는 404이며 HTTP 301이 아니다. canonical에는 query/hash를 넣지 않는다. JS가 꺼져 있으면 meta refresh가 홈페이지로만 이동한다. 임의 경로를 정적 meta 태그만으로 계산할 수 없는 한계이다.
- 옛 HTML 경로 49개(`tools/legacy-pages.txt`): 경로마다 HTTP 200 리디렉션 페이지를 둔다. 404.html은 상태 코드가 404라서 스토어 심사나 정책 크롤러가 옛 개인정보처리방침·지원 URL을 죽은 링크로 볼 수 있다. 이 페이지는 JS 없이도 meta refresh로 같은 경로로 이동하고, JS가 있으면 query/hash까지 유지한다. canonical도 같은 새 URL이다. `node tools/make-stubs.mjs`로 다시 만들며, 테스트가 내용이 생성기와 같은지 확인한다.
- 기타 JSON/WebGL/font 등은 이전 페이지의 상대 자산이다. HTML이 새 호스트로 이동하면 그쪽에서 로드된다. 현재 트리에서 추가 외부 기계 계약은 발견하지 못했으며 외부 앱/스토어의 완전한 목록은 확인 불가하다. 새 요구가 확인되면 명시적으로 보존한다.

검사: `node tools/test.mjs` (Node 22, 외부 패키지 불필요). 실제 HTTP 모델 GET과 404 응답, JS 실행(path/query/hash 및 // 경로), app-ads 해시, OAuth 호스트 보존을 검사한다. 로컬 서버는 Pages의 기본 경로 동작만 모사하며 실제 Pages 배포 검사를 대신하지 않는다.

전체 전환 절차/롤백은 비공개 본 사이트 저장소의 `HOSTING.md`를 따른다. 이 셸을 유지해도 GitHub Pages 의존성은 **옛 URL 호환용**으로 영구히 남는다. 저장소 이름 교체 시 무중단을 보장할 수 없다.
