/*
 * 사이트 설정 — 이 파일만 고치면 됩니다.
 * 비어 있는 값('')은 화면에 표시되지 않습니다.
 */
window.SITE_CONFIG = {
  // 신청·문의 양식이 전송될 주소 (Formspree / Google Apps Script 등, README 참고).
  // 비워두면 방문자의 메일 앱이 열려 아래 email 주소로 보내지는 방식으로 동작합니다.
  formEndpoint: '',

  email: 'ybtourpus@daum.net',   // 신청·문의가 도착하는 메일 (노랑풍선 센텀스카이)
  formSource: '인투여행사 홈페이지', // 메일 제목·본문에 붙는 접수처 표시
  phone: '010-7537-3545',

  // 푸터 사업자 정보 (확보되면 입력)
  operator: '협력 여행사: 센텀스카이(주) (노랑풍선 공식대리점) | 대표자: 이은경',
  bizNo: '사업자등록번호: 617-81-64534',
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
