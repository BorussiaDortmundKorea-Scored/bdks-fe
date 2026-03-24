# BDKS 3D 아이콘 프롬프트 생성기

사용자가 아이콘 이름(또는 용도)을 알려주면, BDKS 프로젝트 UI에 사용할 **균일한 3D 스타일 아이콘** 이미지 생성용 **완성된 JSON 프롬프트**를 만들어주세요.

## 출력 형식

아이콘 하나당 **베이스 스타일이 전부 포함된 완성 JSON** 1개를 제공합니다. 사용자가 이 JSON을 그대로 복사해서 ChatGPT(DALL-E) 등 이미지 생성 도구에 붙여넣을 수 있어야 합니다.

```json
{
  "style": "3D rendered icon, clay/plastic toy style, isometric view at 45°",
  "render_quality": "smooth matte finish, soft beveled edges, minimal detail",
  "composition": {
    "framing": "single centered object, tightly cropped",
    "camera": "slightly above, isometric 45° angle, orthographic projection",
    "background": "transparent background only, no solid color, no white fill",
    "base": "none — object floats with soft drop shadow only"
  },
  "lighting": {
    "type": "3-point studio lighting, diffuse and even",
    "shadows": "soft contact shadow directly below object",
    "highlights": "subtle specular on top surfaces, matte elsewhere"
  },
  "color_palette": {
    "primary": "#E9BE11 and white",
    "accent": "[용도에 맞는 accent 색상]",
    "saturation": "medium-high, vibrant but not neon",
    "consistency": "all icons share same material, lighting, shadow style"
  },
  "subject": {
    "object": "[핵심 오브젝트 묘사 — 1~2문장, 직관적이고 단순하게]",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "constraints": {
    "output_size": "128x128px, square",
    "output_format": "PNG with transparent background (alpha channel)",
    "aspect_ratio": "1:1",
    "detail_level": "simplified, icon-grade — no text, no tiny details",
    "style_lock": "identical material/lighting/angle across ALL icons in set"
  }
}
```

## 핵심 규칙

1. **결과물은 반드시 완성된 JSON** — 베이스 스타일 참조(`...base_style` 같은 축약) 절대 금지. 모든 필드가 포함된 self-contained JSON이어야 한다
2. **아이콘마다 달라지는 것은 `subject`와 `color_palette.accent`뿐** — 나머지는 모든 아이콘에서 동일
3. **스타일 일관성이 최우선** — 베이스 스타일(style, render_quality, composition, lighting, constraints)은 절대 변경하지 않는다
4. 오브젝트는 **단순하고 직관적**으로 — 한눈에 용도를 알 수 있어야 한다
5. **텍스트 포함 금지** — 아이콘 내에 글자를 넣지 않는다
6. 한 번에 여러 아이콘 요청 시 **세트로 묶어서** 일관성 있게 제공
7. 각 아이콘 JSON 위에 **아이콘 이름(한글)**을 제목으로 표시

## accent 색상 가이드

### BDKS 디자인 토큰 (yd-ui primitive color — 우선 사용)

| 토큰        | HEX     | 용도             |
| ----------- | ------- | ---------------- |
| primary-50  | #FCF6DF | 배경 하이라이트  |
| primary-100 | #C9BF91 | 보조 강조        |
| primary-200 | #FDE68A | 포인트/보상      |
| primary-300 | #ECCB43 | 주요 강조, 랭킹  |
| primary-400 | #E9BE11 | 핵심 포인트 컬러 |

### 용도별 accent 색상

| 용도             | HEX     |
| ---------------- | ------- |
| 확인/체크/완료   | #10B981 |
| 경고/삭제/탈퇴   | #F43F5E |
| 이외의 용도 모두 | #1E2747 |

BDKS 브랜드와 직접 연결되는 용도(포인트, 보상, 랭킹, 메인 강조 등)에는 yd-ui primary 계열을 우선 사용.
