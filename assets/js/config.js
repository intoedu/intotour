/*
 * 사이트 설정 — 이 파일만 고치면 됩니다.
 * 비어 있는 값('')은 화면에 표시되지 않습니다.
 */
window.SITE_CONFIG = {
  // 신청·문의 자동 발송 (FormSubmit). 비워두면 방문자의 메일 앱이 열리는 방식으로 동작합니다.
  // 첫 접수 때 formTo 메일함으로 'Activate Form' 인증 메일이 오며, 버튼을 눌러야 발송이 시작됩니다.
  formEndpoint: 'https://formsubmit.co/ajax/ybtourpus@daum.net',
  formTo: 'ybtourpus@daum.net',        // 신청서가 도착하는 메일
  formCc: 'imtv2414@gmail.com',        // 같은 신청서를 함께 받는 메일 (최재혁)
  formSource: '인투여행사 홈페이지',     // 메일 제목·본문에 붙는 접수처 표시

  email: 'imtv2414@gmail.com',         // 사이트에 표시되는 연락 메일 (최재혁)
  phone: '010-7537-3545',

  // 푸터 사업자 정보
  operator: '',
  bizNo: '상호: 센텀스카이(주) | 사업자등록번호: 617-81-64534',
  tourNo: '',   // 예: '관광사업(여행업) 등록번호: 제0000-000000호'
  address: '주소: 부산광역시 동래구 충렬대로 296, 201호(낙민동, 석천빌딩)',

  // SNS 링크 (주소를 넣으면 '문의하기' 영역에 버튼이 나타납니다)
  sns: {
    kakao: '',      // 카카오톡 채널 (예: https://pf.kakao.com/_xxxx)
    instagram: '',
    blog: '',       // 네이버 블로그
    youtube: '',
    facebook: ''
  }
};
