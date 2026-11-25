---
title: '어드민 서버 아키텍처 ① — 의존은 아래로만'
description: 'AI 에이전트가 코드를 많이 쓰는 어드민 서버의 지금 구조입니다. controller → service → repository → domain 한 방향 계층, DTO 를 controller 에서 바꾸는 이유, usecase 와 service 가 섞인 지금, DDD 를 어디까지 쓰는지.'
pubDate: 2026-11-08
category: architecture
platform: backend
tags: ['backend', 'spring', 'architecture', 'layered-architecture', 'ddd', 'ai-agent']
draft: true
---

> **어드민 서버 아키텍처 시리즈**
> ① 의존은 아래로만 (이 글) · [② 어긋난 의존과 고친 것](../admin-server-architecture-2-what-went-wrong/) · [③ 규칙 0개에서 가드까지](../admin-server-architecture-3-how-we-moved/)
>
> 같은 생각을 앱과 웹에 적용한 이야기는 [안드로이드 아키텍처 시리즈](../android-architecture-1-one-truth/) 와 [웹 어드민 아키텍처 시리즈](../web-admin-architecture-1-structure/) 에 있습니다.

## 한 줄로

**어드민 서버는 controller → service → repository → domain 네 계층으로 나뉘고, 의존은 아래로만 흐릅니다.** AI 에이전트가 코드를 많이 쓰는 저장소라, 이 한 방향을 규칙 문서에 적고 빌드보다 먼저 도는 가드로 지킵니다. 지금 위반은 0건입니다.

어드민 서버는 [웹 어드민](../web-admin-architecture-1-structure/)(운영자 · CS · 콘텐츠 담당자가 쓰는 사내 운영 도구)이 부르는 관리 API 서버입니다. Spring Boot 와 JPA 로 만들었고, 자바 파일이 1,321개입니다. 시리즈는 세 편입니다. 이 글은 지금의 구조와 그 이유를, [②편](../admin-server-architecture-2-what-went-wrong/) 은 거꾸로 가던 의존과 그것을 고친 사례를, [③편](../admin-server-architecture-3-how-we-moved/) 은 규칙 문서에 규칙이 하나도 없던 때부터 가드가 생기기까지를 다룹니다.

## 네 계층과 의존 방향

![어드민 서버의 계층. 자바 파일 1,321개 기준으로 controller(412) → service(476, usecase 포함) → repository(82) → domain(127) 순서로 아래로만 의존한다. client(63)는 다른 서비스로 가는 어댑터로 service 와 같은 높이에 있고, exception 잎(59)은 모든 계층이 쓰지만 다른 계층을 부르지 않는다. 위로 가는 의존과 controller 가 repository · domain 을 바로 쓰는 것은 금지다](./layers.svg)

| 계층 | 파일 | 하는 일 |
| --- | --- | --- |
| **controller** | 412 | HTTP 입출력, 요청 검증, 요청을 서비스 DTO 로 바꾸기, 응답 조립 |
| **service** | 476 | 업무 흐름 조율, 여러 도메인 · 바깥 호출 엮기, 엔티티 ↔ DTO 변환, 트랜잭션 경계 |
| **repository** | 82 | 저장과 조회(JpaRepository · QueryDSL) |
| **domain** | 127 | 엔티티, 값, 도메인 규칙, 도메인 예외 |

계층이 아닌 자리가 셋 더 있습니다.

- **client**(63): 다른 내부 서비스를 부르는 어댑터입니다. service 와 같은 높이에 있고, service 가 부릅니다.
- **exception 잎**(59): 오류 코드와 예외 타입입니다. 모든 계층이 쓸 수 있지만, 이 잎은 어떤 계층도 부르지 않습니다. 잎을 따로 둔 이유는 [②편](../admin-server-architecture-2-what-went-wrong/) 에 있습니다.
- **계층 밖**(102): 설정, 보안, 로깅입니다. 가드가 방향을 분석하지 않고 리뷰로 봅니다.

규칙은 한 문장입니다. **계층 의존은 아래로만 갑니다.** 위로 가는 것, 한 계층을 건너뛰는 것(controller → repository, controller → domain)은 금지입니다.

왜 한 방향일까요. 화살표가 한쪽으로만 흐르면 아래 계층을 바꿀 때 영향이 위로만 퍼집니다. 위를 바꿀 때는 아래가 모릅니다. 양쪽으로 흐르면 어디를 고쳐도 반대쪽을 같이 봐야 합니다. 이 저장소는 AI 에이전트가 코드를 많이 쓰는 곳이라, «조심해서 쓰겠지» 대신 규칙으로 막아 둡니다. 이 생각은 [왜 아키텍처인가](../why-architecture-in-ai-era/) 에 더 자세히 적었습니다.

## 요청 객체는 어디서 서비스 DTO 로 바꾸나

규칙에는 한 줄이 더 있습니다. **요청 객체를 서비스 DTO 로 바꾸는 일은 controller 쪽이 맡고, 서비스 DTO 는 controller 의 요청 타입을 받지 않습니다.**

```java
// controller 쪽 요청 클래스가 스스로 서비스 DTO 로 바뀐다
public class PostDeviceActivationRequest {
    public DeviceActivationDTO toDeviceActivationDTO() { ... }
}

// controller 는 바꾼 DTO 만 service 에 넘긴다
deviceManagementService.activateDevice(request.toDeviceActivationDTO());
```

반대로 서비스 DTO 의 생성자가 요청 클래스를 받으면(`new DeviceActivationDTO(request)`), service 가 controller 의 타입을 알게 됩니다. 아래 계층이 위 계층을 아는, 거꾸로 가는 의존입니다. 실제로 이런 곳이 세 군데 있었고, 지금의 규칙은 그것을 정리하면서 생겼습니다([②편](../admin-server-architecture-2-what-went-wrong/)).

## usecase 와 service — 두 길이 섞여 있다

service 계층 안에는 usecase 가 있습니다. 인터페이스 27개와 구현 25개가 9개 도메인에 있습니다. 계층으로 치면 usecase 는 service 의 하위 패키지이고, 가드도 service 로 읽습니다.

문제는 길이 두 개라는 점입니다. 서비스 구현 70개 중 35개가 repository 를 직접 부릅니다. 그래서 «service → repository» 길과 «service → usecase → repository» 길이 함께 있습니다. 언제 usecase 를 만들고 언제 service 에서 바로 부르는지는 **아직 정하지 않았습니다.** 규칙 문서에도 «정하려면 사용자 결정을 받는다 — 빈 항목이지 지어 쓰지 않는다» 라고만 적혀 있습니다.

이 항목은 지금 위에서 채워지는 중입니다. 팀 공통 규칙에서 «usecase 는 Entity · 값 객체(VO)만 다루고, 저장소 · 트랜잭션 · 바깥 호출은 응용 계층(service)이 맡는다» 로 정의를 좁히는 개정이 진행 중입니다. 다른 서비스가 먼저 반영하고, 어드민 서버는 그다음 차례입니다. 이 이야기는 [③편](../admin-server-architecture-3-how-we-moved/) 끝에서 다시 봅니다.

## DDD 는 어디까지

이 서버는 DDD 를 바탕으로 계층을 나눕니다. 그런데 규칙 문서에는 애그리거트 · 값 객체 · 도메인 서비스에 대한 규칙이 없습니다. 쓰지 않기로 정한 것이 아니라, **아직 정하지 않은 항목** 입니다. 근거가 되는 결정 기록이 없어서 규칙 문서에 지어 넣지 않았습니다.

저는 DDD 의 생각을 믿습니다. 다만 도메인을 충분히 알기 전에 애그리거트와 컨텍스트 경계를 먼저 그으면, 모르는 채로 그은 선이 나중에 발목을 잡는다고 봅니다. 그래서 저는 계층과 방향부터 지키고, 도메인 규칙은 알게 된 만큼만 엔티티로 옮기는 쪽이 맞다고 봅니다.

엔티티는 72개입니다. setter 를 열어 둔 것은 3개뿐이고, 상태를 바꾸는 곳은 대체로 `update…` · `activate()` 같은 메서드를 거칩니다. 행위가 많은 엔티티도 있습니다. 가족(`requestToAddMember` · `confirmToAddMember`), 기기(`activate` · `deactivate`) 같은 곳입니다. 하지만 메서드 이름을 보면 행위의 상당수는 아직 «필드 덮어쓰기» 입니다. 이 차이가 실제 버그로 이어진 사례도 [②편](../admin-server-architecture-2-what-went-wrong/) 에 있습니다.

## 정리

- 계층은 controller → service → repository → domain 넷이고, **의존은 아래로만** 갑니다. client 는 service 옆, 오류 코드는 아무도 부르지 않는 잎에 둡니다.
- 요청 → 서비스 DTO 변환은 **controller 쪽** 이 합니다. 서비스 DTO 가 요청 타입을 받으면 거꾸로 가는 의존이 됩니다.
- usecase 와 service 의 경계, 애그리거트 · 값 객체 규칙은 **아직 비어 있는 항목** 입니다. 모르는 것을 지어 쓰지 않습니다.

다음 편에서는 이 규칙이 생기기 전에 거꾸로 가던 의존 19건과, 엔티티가 «부분 수정» 을 몰라서 생긴 버그를 봅니다.

[② 어긋난 의존과 고친 것 →](../admin-server-architecture-2-what-went-wrong/)
