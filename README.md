# INTO TOUR (인투여행사) 홈페이지

정적 웹사이트(HTML/CSS/JS)로, GitHub Pages에 그대로 배포됩니다.
참고 사이트: [SLT TOUR](https://intoedu.github.io/SLT-Tour-Home-Page/) 구성(섹션형 원페이지) + 연보라·아이보리·연노랑 그라데이션 배경, 검정 글씨

## 구성

| 메뉴 | 위치 |
| --- | --- |
| 홈 | `#home` (메인 비주얼) |
| 소개·인사말 | `#about`, `#greeting`, `#destinations` |
| 사업 안내 | `#services`, `#why`, `#process` |
| 공지·소식 | `#news` — `data/notices.json` |
| 신청·예약 | `#booking` 여행 신청서 |
| 문의하기 | `#contact` 연락처 + 문의 양식 + SNS |

- 한/영 전환: 우측 상단 KO/EN. 한국어 원문은 `index.html`, 영어는 `assets/js/i18n.js`
- 주소 뒤에 `?lang=en`을 붙이면 영어로 열립니다.

## 수정 방법

- **연락처·사업자정보·SNS·양식 전송 주소**: `assets/js/config.js`
- **공지 추가**: `data/notices.json` 맨 위에 항목 추가 (`category`: `notice` 공지 / `news` 소식, `pinned`: 상단 고정)
- **색상**: `assets/css/style.css` 상단 변수 (배경 `--lavender`·`--bg`·`--cream`, 글씨 `--ink`, 포인트 `--yellow`)
- **사진**: 현재 Unsplash 무료 이미지를 사용 중입니다. 실제 여행 사진이 생기면 `assets/img/`에 넣고 `src`를 교체하세요.

## 신청·문의 양식 (자동 발송: FormSubmit)

- 신청·문의는 [FormSubmit](https://formsubmit.co)으로 `ybtourpus@daum.net`에 자동 발송되고, `imtv2414@gmail.com`(최재혁)이 참조로 함께 받습니다. 설정은 `config.js`의 `formEndpoint`·`formTo`·`formCc`입니다.
- 메일 제목은 `[인투여행사 홈페이지] 여행 신청 - 이름 / 여행유형` 형식이라 노랑풍선 메일함에서 구분됩니다.
- **최초 1회 인증 필요**: 첫 접수 때 `ybtourpus@daum.net`으로 FormSubmit의 "Activate Form" 메일이 옵니다. 버튼을 눌러야 이후 접수가 전달됩니다.
- 인증 후 FormSubmit이 알려주는 랜덤 주소(`https://formsubmit.co/ajax/xxxxxxxx`)로 `formEndpoint`를 바꾸면 메일 주소가 코드에 노출되지 않아 스팸을 줄일 수 있습니다.
- 자동 발송이 실패하면 방문자의 메일 앱이 열려 같은 내용을 보내도록 되어 있어 접수가 사라지지 않습니다.

## 오픈 전 확인 필요 (고객 확인 사항)

- [ ] 대표 인사말 문구 확정 (현재 초안), 영문 이름 표기 (현재 `Jaehyuk Choi` / `Johan`)
- [ ] 서비스 4종 확정 (현재 예시) — 여행지는 전 세계 진행 가능 확인됨, 대표 지역 4곳(일본·동남아·튀르키예·유럽)은 원하면 교체
- [x] 사업자 정보: 센텀스카이(주) / 대표자 이은경 / 617-81-64534 / 부산 동래구 (2015-05-04 발급 등록증 기준) → `config.js`
- [ ] 관광사업(여행업) 등록번호, 통신판매업 신고번호(해당 시) → `config.js`
- [x] 표기: 노랑풍선 언급 없이 센텀스카이(주) 사업자 정보 + 대표 이은경 · 공동대표 최재혁
- [x] 대표: 공동대표 이은경 · 최재혁(Johan), 인사말 서명은 최재혁 공동대표
- [ ] 상담 운영 시간
- [ ] SNS(카카오톡 채널·인스타그램·블로그 등) 주소
- [ ] 로고: 시안(아치형 문 + 해 + 지평선 = 세상 속으로 들어가는 문) 적용 중 → 고객 확인 필요. 원본 `logo.svg`, 파비콘 `favicon.svg`
- [ ] 도메인 구매 후 GitHub Pages 커스텀 도메인 연결 (`CNAME`)

## 로컬 미리보기

```bash
python3 -m http.server 8000
# http://localhost:8000
```
(`data/notices.json`을 불러오기 때문에 파일을 더블클릭해서 열면 공지 목록이 보이지 않습니다.)
