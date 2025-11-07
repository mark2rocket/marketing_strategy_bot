# 디자인 시스템 가이드

마케팅 분기 전략 봇의 디자인 시스템 문서

## 📐 디자인 원칙

1. **일관성 (Consistency)**: 모든 화면에서 동일한 패턴과 컴포넌트 사용
2. **명확성 (Clarity)**: 사용자가 명확하게 이해할 수 있는 UI
3. **효율성 (Efficiency)**: 빠르고 직관적인 작업 흐름
4. **접근성 (Accessibility)**: 모든 사용자가 사용 가능한 인터페이스

---

## 🎨 컬러 팔레트

### Primary Colors (브랜드 메인)
주요 액션, 버튼, 링크에 사용

- **Primary 500**: `#0ea5e9` (메인)
- **Primary 600**: `#0284c7` (Hover)
- **Primary 700**: `#0369a1` (Active)

### Secondary Colors (보조)
보조 액션, 강조에 사용

- **Secondary 500**: `#a855f7` (메인)
- **Secondary 600**: `#9333ea` (Hover)

### Semantic Colors

#### Success (성공)
- **Success 500**: `#22c55e`
- 사용처: 성공 메시지, 완료 상태

#### Warning (경고)
- **Warning 500**: `#f59e0b`
- 사용처: 주의 메시지, 중요 알림

#### Danger (위험)
- **Danger 500**: `#ef4444`
- 사용처: 오류 메시지, 삭제 액션

#### Neutral (중립)
- **Neutral 50-900**: 그레이스케일
- 사용처: 텍스트, 배경, 경계선

---

## 📝 타이포그래피

### Font Family
```css
Primary: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui
Mono: 'JetBrains Mono', Menlo, Monaco, monospace
```

### Font Sizes

| Name | Size | Line Height | 사용처 |
|------|------|-------------|--------|
| xs | 12px | 16px | Caption, Helper text |
| sm | 14px | 20px | Body small, Labels |
| base | 16px | 24px | Body text (기본) |
| lg | 18px | 28px | Subtitle |
| xl | 20px | 28px | Heading 4 |
| 2xl | 24px | 32px | Heading 3 |
| 3xl | 30px | 36px | Heading 2 |
| 4xl | 36px | 40px | Heading 1 |
| 5xl | 48px | 48px | Display |

### Font Weights
- **Regular**: 400 (기본 텍스트)
- **Medium**: 500 (강조, 버튼)
- **Semibold**: 600 (소제목)
- **Bold**: 700 (제목)

---

## 📏 Spacing System

8px 기반 스페이싱 시스템

| Name | Value | Usage |
|------|-------|-------|
| 0.5 | 2px | 매우 작은 간격 |
| 1 | 4px | 최소 간격 |
| 2 | 8px | 기본 간격 |
| 3 | 12px | 작은 섹션 간격 |
| 4 | 16px | 일반 섹션 간격 |
| 6 | 24px | 중간 섹션 간격 |
| 8 | 32px | 큰 섹션 간격 |
| 12 | 48px | 메이저 섹션 간격 |
| 16 | 64px | 페이지 섹션 간격 |

---

## 🔘 컴포넌트 가이드

### Button

#### Variants
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

#### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>  {/* Default */}
<Button size="lg">Large</Button>
```

#### States
- **Default**: 기본 상태
- **Hover**: 마우스 오버
- **Active**: 클릭
- **Disabled**: 비활성화
- **Loading**: 로딩 중

#### 사용 규칙
- Primary: 페이지당 1-2개 (주요 액션)
- Secondary: 보조 액션
- Danger: 삭제, 파기 등 위험한 액션
- Outline/Ghost: 덜 중요한 액션

---

### Input

```tsx
<Input
  label="이메일"
  placeholder="이메일을 입력하세요"
  type="email"
  required
/>

<Input
  label="검색"
  leftIcon={<SearchIcon />}
  placeholder="검색어 입력"
/>

<Input
  label="비밀번호"
  type="password"
  error="비밀번호가 일치하지 않습니다"
/>
```

#### 사용 규칙
- Label은 항상 제공
- Error 상태는 빨간색으로 표시
- Required 필드는 `*` 표시
- Placeholder는 예시 또는 힌트 제공

---

### Card

```tsx
<Card variant="elevated" padding="md">
  <CardHeader>
    <h3 className="text-lg font-semibold">카드 제목</h3>
  </CardHeader>
  <CardBody>
    카드 내용
  </CardBody>
  <CardFooter>
    <Button>액션</Button>
  </CardFooter>
</Card>
```

#### Variants
- **default**: 기본 보더
- **bordered**: 굵은 보더
- **elevated**: 그림자 효과

#### 사용 규칙
- 관련 정보 그룹화
- Hoverable: 클릭 가능한 카드에만 사용
- Padding: 콘텐츠에 따라 조정

---

### Badge

```tsx
<Badge variant="primary">New</Badge>
<Badge variant="success" dot>Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>
```

#### 사용 규칙
- 상태 표시
- 개수 표시 (최대 99+)
- Dot: 간단한 상태 표시

---

## 🔳 Layout Grid

### Container
```tsx
<Container maxWidth="xl">
  {/* Content */}
</Container>
```

Max Widths:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px (기본)
- **2xl**: 1536px
- **full**: 100%

### Responsive Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🌗 Dark Mode

자동 다크 모드 지원

```tsx
// 다크 모드에서 색상 변경
<div className="bg-white dark:bg-neutral-800">
  <p className="text-neutral-900 dark:text-neutral-100">
    텍스트
  </p>
</div>
```

### 다크 모드 컬러 가이드
- **배경**: white → neutral-800/900
- **텍스트**: neutral-900 → neutral-100
- **Border**: neutral-200 → neutral-700

---

## ✨ Animations

### Transitions
```css
transition-all duration-200  /* 기본 */
transition-colors duration-200  /* 색상만 */
transition-transform duration-300  /* 변형만 */
```

### Predefined Animations
```tsx
<div className="animate-fade-in">Fade in</div>
<div className="animate-slide-in">Slide in</div>
<div className="animate-bounce-light">Bounce</div>
```

---

## 📦 Shadows

```tsx
<div className="shadow-soft">Soft shadow</div>
<div className="shadow-medium">Medium shadow</div>
<div className="shadow-strong">Strong shadow</div>
```

---

## ♿ Accessibility

### Color Contrast
- WCAG AA 기준 준수
- 텍스트 대비: 최소 4.5:1
- 큰 텍스트 대비: 최소 3:1

### Keyboard Navigation
- 모든 인터랙티브 요소는 키보드로 접근 가능
- Focus 상태 명확히 표시
- Tab order 논리적 순서 유지

### Screen Readers
- Semantic HTML 사용
- ARIA labels 제공
- Alt text 이미지 설명

---

## 🎯 Best Practices

### Do's ✅
- 일관된 스페이싱 사용
- 의미론적 색상 사용 (success, warning, danger)
- 모바일 우선 반응형 디자인
- 로딩 및 에러 상태 명확히 표시

### Don'ts ❌
- 너무 많은 색상 사용
- 일관성 없는 버튼 스타일
- 작은 터치 타겟 (최소 44x44px)
- 색상으로만 정보 전달

---

## 📚 Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Figma Design File**: [링크 추가]
- **Component Storybook**: [링크 추가]

---

**Version**: 1.0
**Last Updated**: 2024-11-07
