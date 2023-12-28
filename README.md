<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description
친해지길 바라 백엔드를 리팩토링합니다.
- DB 스키마 및 REST API 재설계
- JavaScript/Express -> TypeScript/NestJS
- Raw Query -> TypeORM

<br>

## 🏠 [HOME PAGE](https://together.42jip.net/)

**친해지길 바라**는 동아리 부원들의 상호작용을 돕기 위해 만든 웹 서비스입니다. 원하는 이벤트를 생성하여 사람들을 모을 수 있고, 이미 생성된 이벤트에 참가 신청을 할 수도 있습니다. 신청자들을 기반으로 팀 매칭 기능을 제공합니다.

<br>

## 기술 스택
<p align='center'>
    <img src="https://img.shields.io/badge/Node.js-339933?logo=Node.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=white"/>
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=NestJS&logoColor=white"/>
    <img src="https://img.shields.io/badge/MySQL-4479A1?logo=MySQL&logoColor=white">
    <img src="https://img.shields.io/badge/Google OAuth-4285F4?logo=google&logoColor=white">
    <img src="https://img.shields.io/badge/Slack Bot-4A154B?logo=Slack&logoColor=white">
    <br>
    <img src="https://img.shields.io/badge/GitHub Actions-2088FF?logo=GitHub Actions&logoColor=white">
    <img src="https://img.shields.io/badge/Amazon Route53-8C4FFF?logo=Amazon Route53&logoColor=white">
    <img src="https://img.shields.io/badge/Amazon EC2-FF9900?logo=Amazon EC2&logoColor=white">
    <img src="https://img.shields.io/badge/Amazon RDS-527FFF?logo=Amazon RDS&logoColor=white">
</p>

<br>

## 실행 방법
### 1. git clone
```sh
git clone https://github.com/Together42/nest-backend.git
```
### 2. 백엔드 루트 폴더에 `.env` 생성
```
# 백엔드를 실행할 port, 디폴트 9999
BACK_PORT=

# Google OAuth 설정
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_PROMPT=

# JWT 설정
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

# DB 설정
MYSQL_ROOT_PASSWORD=
MYSQL_HOST=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_PORT=

# 슬랫봇 설정
SLACK_BOT_USER_OAUTH_ACCESS_TOKEN=
SLACK_CHANNEL_JIPHYEONJEON=

# Holiday를 가져오기 위한 OpenAPI 설정
SERVICE_KEY=

# 클라이언트 주소, 백엔드 로컬 환경에서 실행 시 프론트도 로컬 환경 실행 추천.
FRONT_URL=http://localhost:{프론트엔드 실행 포트}
```

### 3. 로컬 DB 실행
```
docker-compose up test_db -d --build
```

### 4. 프론트엔드 클론 및 실행
👉 [프론트엔드 레포 바로 가기](https://github.com/Together42/frontend?tab=readme-ov-file#%EF%B8%8F-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B5%AC%EB%8F%99-%EB%B0%A9%EB%B2%95)

### 5. 실행
```
yarn install && yarn start:dev
```

### 6. Swagger에서 API 명세 확인
👉 `http://localhost:{백엔드 실행 포트}/swagger`

<br>

## ERD
![together-ERD](https://github.com/Together42/nest-backend/assets/74581396/88d077a5-526b-4750-8358-7145bd1a80b6)

<br>

## License

Nest is [MIT licensed](LICENSE).
