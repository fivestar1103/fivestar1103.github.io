# Gumroad 교체안 — 1.7.0 배포와 함께 게시할 초안

검수: 2026-09-13 KST. 실제 상품 API에서 공개 본문·요약·가격과 판매 합계를 읽었다. 라이브 페이지는 수정하지 않았다. 아래 문구의 5회 체험은 이번 로컬 후보에 구현되어 있으므로 CWS 1.7.0 배포 전 게시하면 안 된다.

**Product summary**

Fix subtitle timing with Smart Sync Beta. Try it free, then keep Pro for life with the founding offer.

**한국어 리드**

원하는 자막을 찾았는데 타이밍이 맞지 않나요?

Smart Sync Beta를 시작하면 영상의 소리를 기기에서 분석해 자막 타이밍을 찾습니다. 확신하기 어려운 결과는 먼저 제안하고, 적용한 뒤에도 되돌릴 수 있습니다. 무료로 5회 적용해 보세요. 실패와 거절은 차감하지 않고, 되돌리면 횟수도 복구됩니다.

파운딩 Pro는 $34.99 한 번 결제로 체험 횟수 제한 없이 이용할 수 있습니다. 브라우저·영상·자막에 따라 정확도가 다르고, 일부 플레이어에서는 오디오를 캡처할 수 없습니다. 시청 내내 자동으로 다시 맞추는 기능은 아직 제공하지 않습니다.

AI 번역·자동 자막 생성·더 큰 자막 라이브러리·A–B 반복·사전은 앞으로 추가할 기능입니다. 아직 사용할 수 없으며 출시일은 정해지지 않았습니다. 파운딩 구매자는 이후 출시되는 Pro 기능도 받습니다.

**日本語リード**

字幕は見つかったのに、タイミングが合わないときに。

Smart Sync Betaを開始すると、端末内で動画の音声を解析して字幕のタイミングを探します。確信できない結果は提案として表示し、適用後も元に戻せます。適用5回を無料で試せます。失敗や提案の辞退は数えず、元に戻すと回数も戻ります。

ファウンディングProは$34.99の買い切りで、体験回数の制限を解除します。精度はブラウザ・動画・字幕により異なり、音声を取得できないプレーヤーもあります。再生中の継続的な自動補正はまだ利用できません。

AI翻訳・自動字幕生成・より大きなライブラリ・A–Bリピート・辞書は今後の予定で、まだ利用できず、公開日は未定です。ファウンディング購入者は、今後公開されるPro機能も受け取れます。

**English body**

## Found the subtitles. Now make them fit.

Load a subtitle file, start Smart Sync Beta during dialogue, and let it look for a timing adjustment. It processes the audio on your device. If the result needs your judgment, you can try the suggested adjustment. Undo is always there for the result you just applied.

Try 5 applied syncs free. Failed attempts and declined suggestions do not use a trial. Undo restores that use. Test it on the videos you actually watch before buying.

## What you can use today

- **Smart Sync Beta without the free-trial limit.** Run it when the subtitle timing needs help.
- **A higher OpenSubtitles download limit:** up to 300 download requests per installation in a rolling 24 hours, compared with 30 on Free. Downloads also depend on the shared OpenSubtitles allowance and service availability; this is not unlimited or guaranteed access.
- **The existing free extension:** search, local subtitle files, styling, manual timing controls and saved subtitles remain available to everyone.

Smart Sync is still a beta. Accuracy depends on the video and subtitle file. Some players cannot provide tab audio. Chrome may ask for permission or an additional toolbar click. Optional on-device speech downloads can improve matching on supported browsers. Smart Sync runs when you start it; it does not continuously monitor and correct the entire viewing session.

## Planned for Pro

AI Translate, Auto Captions, a larger subtitle library, A–B repeat and a dictionary are planned. They are not available today, and their release dates are not announced. The translation preview above is a concept demonstration, not a working feature.

Founding members receive future Pro features as they ship. Buy for the beta you can try today and the founding access, rather than for a dated promise about a particular future feature.

## The founding offer

**$34.99, paid once. Lifetime Pro access.** No recurring subscription for founding members. The offer is limited to the first 50 founding seats. Optional founding credits are included.

The currently announced full-launch price is **$3.99/month or $23.99/year**. Founding members keep their lifetime access when subscriptions become available.

**30-day refund policy. Full refund if Pro does not fully launch by September 30, 2026.** Smart Sync being available as a beta does not change this full-launch promise.

## Questions before buying

**Is this available now?** Smart Sync is available as a beta. The other roadmap features are not.

**Does it work on every video?** No. Start with the free trial on your browser and the players you use. Compatibility and results vary.

**Do I need an OpenSubtitles account?** Not for the extension's current built-in search and download flow. Daily limits still apply.

**Does my audio leave the device?** Smart Sync processes captured audio on your device. Subtitle search and downloads use OpenSubtitles; licence verification uses Gumroad. Optional usage analytics can be disabled in Settings.

**How do I activate?** Copy the licence key from your Gumroad receipt, open the extension's Pro tab, paste the key and choose Activate. Use the feedback link if activation fails.

**What happens when subscriptions launch?** Existing founding licences remain lifetime licences. You do not need to subscribe again.

---

## 운영 판단이 필요한 부분

1. **9월 30일 약속은 이번 수정에서 삭제하지 않는다.** 현재 확장 UI는 “fully launch”를 조건으로 전액 환불을 약속한다. 베타 배포만으로 이행했다고 단정했던 이전 초안은 사용하지 않는다. 9/27에 구현·지원 상태를 평가하고, 미달이면 약속을 존중하는 환불·명시적 대안 동의 절차를 준비한다. 구매자에게 연락하거나 환불을 실행하지 않았다.
2. **가격을 즉시 바꾸지 않는다.** $3.99/$23.99는 이미 공개돼 있다. 수익 모델 문서의 $4.99/$34.99는 향후 신규 고객용 후보이며, 가격 변경을 선택할 때 페이지·CWS·확장 문구·실제 체크아웃을 함께 바꿔야 한다.
3. “50 seats”를 매진으로 바꾸지 않는다. 실제 상품 판매 합계는 1건이다. 9/30 종료를 선택하면 “기간 종료”라고 설명하고 기존 구매 약속을 유지한다.
4. 현재 두 영상 중 번역 영상의 목업 표시를 유지한다. Smart Sync 데모도 이번 1.7.0의 실제 동작과 시간으로 교체하는 편이 좋다. “1분 안에 마지막 줄까지 고정”, “세션당 34번”은 근거·조건을 재현하지 못해 본문에서 제거했다.
5. 다운로드 제한 완화는 보조 혜택이다. 공용 풀 100 수준인 상태에서 “300회 보장”을 판매하지 않는다. Light 구매·기존 API key 연결·잔여량 검증 후에도 공용 한도 조건은 남겨야 한다.

원본: [라이브 상품](https://iknowhim.gumroad.com/l/subtitleoverlay-pro), [공개 상품 API 스냅샷](./gumroad-live.json). 원본에는 구매자 정보와 인증값이 없다.

## 1.7.0 이미지 업로드 목록

- 커버/갤러리: `store-shots/store-1.png`부터 `store-5.png`
- 로드맵: `store-shots/cover-roadmap.png`
- 썸네일: `store-shots/gumroad-thumbnail.png` (600×600)
- CWS 리스팅 아이콘: `brand/icon_128.png` (판 있는 스토어용)

이 파일은 출시용 초안이다. 기존 9월 30일 출시/환불 약속과 파운딩 평생 이용권 조건은 유지한다.
