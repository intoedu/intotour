/*
 * 사이트 설정 — 이 파일만 고치면 됩니다.
 * 비어 있는 값('')은 화면에 표시되지 않습니다.
 */
window.SITE_CONFIG = {
  // 신청·문의 양식이 전송될 주소 (Formspree / Google Apps Script 등, README 참고).
  // 비워두면 방문자의 메일 앱이 열려 아래 email 주소로 보내지는 방식으로 동작합니다.
  formEndpoint: '',

  email: 'imtv2414@gmail.com',
  phone: '010-7537-3545',

  // 푸터 사업자 정보 (확보되면 입력)
  bizNo: '',    // 예: '사업자등록번호: 000-00-00000'
  tourNo: '',   // 예: '관광사업 등록번호: 제0000-000000호'
  address: '',  // 예: '서울시 ○○구 ○○로 00'

  // SNS 링크 (주소를 넣으면 '문의하기' 영역에 버튼이 나타납니다)
  sns: {
    kakao: '',      // 카카오톡 채널 (예: https://pf.kakao.com/_xxxx)
    instagram: '',
    blog: '',       // 네이버 블로그
    youtube: '',
    facebook: ''
  }
};
