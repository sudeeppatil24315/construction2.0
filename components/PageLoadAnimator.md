# PageLoadAnimator Component

## Overview

The `PageLoadAnimator` component orchestrates page load animations in a logical sequence (top to bottom). It animates elements with natural easing functions and respects reduced motion preferences.

**Validates:** Requirements 5.6, 5.4

## Features

- ✅ Animates elements in logical order (top to bottom)
- ✅ Uses natural easing functions for smooth motion
- ✅ Respects `prefers-reduced-motion` user preference
- ✅ Configurable stagger delay and animation duration
- ✅ Supports custom styling and element types

## Usage

### Basic Usage

```tsx
import PageLoadAnimator from '@/components/PageLoadAnimator';

function MyPage() {
  return (
    <PageLoadAnimator>
      <PageLoadAnimator.Item>
        <HeroSection />
      </PageLoadAnimator.Item>
      <PageLoadAnimator.Item>
        <ServicesSection />
      </PageLoadAnimator.Item>
      <PageLoadAnimator.Item>
        <ContactSection />
      </PageLoadAnimator.Item>
    </PageLoadAnimator>
  );
}
```

### With Custom Timing

```tsx
<PageLoadAnimator 
  delay={0.3}           // Initial delay before animations start
  staggerDelay={0.2}    // Delay between each item
  duration={0.8}        // Duration of each animation
>
  <PageLoadAnimator.Item>First Section</PageLoadAnimator.Item>
  <PageLoadAnimator.Item>Second Section</PageLoadAnimator.Item>
  <PageLoadAnimator.Item>Third Section</PageLoadAnimator.Item>
</PageLoadAnimator>
```

### With Custom Styling

```tsx
<PageLoadAnimator className="my-container" style={{ padding: '20px' }}>
  <PageLoadAnimator.Item 
    className="my-item" 
    style={{ marginBottom: '40px' }}
  >
    Content
  </PageLoadAnimator.Item>
</PageLoadAnimator>
```

### With Custom Element Types

```tsx
<PageLoadAnimator as="main">
  <PageLoadAnimator.Item as="section">
    Section Content
  </PageLoadAnimator.Item>
  <PageLoadAnimator.Item as="article">
    Article Content
  </PageLoadAnimator.Item>
</PageLoadAnimator>
```

## Props

### PageLoadAnimator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Child elements to animate |
| `delay` | `number` | `0` | Delay before starting the animation sequence (in seconds) |
| `staggerDelay` | `number` | `0.15` | Stagger delay between children (in seconds) |
| `duration` | `number` | `0.6` | Animation duration for each element (in seconds) |
| `className` | `string` | - | Additional CSS classes |
| `style` | `React.CSSProperties` | - | Additional inline styles |

### PageLoadAnimator.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Content to animate |
| `className` | `string` | - | Additional CSS classes |
| `style` | `React.CSSProperties` | - | Additional inline styles |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | HTML element type to render |
| `duration` | `number` | `0.6` | Animation duration (in seconds) |

## Animation Behavior

### Normal Motion

When animations are enabled (default):
- Elements start with `opacity: 0` and `y: 40px` (below their final position)
- Elements animate to `opacity: 1` and `y: 0` with natural easing
- Each element animates in sequence with the specified stagger delay
- Uses cubic-bezier easing `[0.22, 1, 0.36, 1]` for smooth, natural motion

### Reduced Motion

When user has `prefers-reduced-motion: reduce` enabled:
- All delays are set to 0
- Vertical movement is disabled (`y: 0`)
- Animation duration is reduced to 0.01s (instant)
- Elements still fade in but without motion

## Animation Sequence

The component animates children in a top-to-bottom sequence:

1. **Initial Delay**: Wait for `delay` seconds
2. **First Item**: Animates in
3. **Stagger Delay**: Wait for `staggerDelay` seconds
4. **Second Item**: Animates in
5. **Stagger Delay**: Wait for `staggerDelay` seconds
6. **Third Item**: Animates in
7. And so on...

## Easing Functions

The component uses the `easeOut` easing function from the animation system:

```typescript
easeOut: [0.22, 1, 0.36, 1]
```

This creates a natural motion where elements start quickly and slow down as they reach their final position, similar to real-world physics.

## Accessibility

- ✅ Respects `prefers-reduced-motion` user preference
- ✅ Maintains semantic HTML structure
- ✅ Does not interfere with keyboard navigation
- ✅ Content is accessible even if animations fail

## Performance

- Animations are GPU-accelerated (opacity and transform properties)
- Uses Framer Motion's optimized animation engine
- Minimal JavaScript execution during animations
- No layout thrashing or reflows

## Examples

### Landing Page

```tsx
// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen">
      <PageLoadAnimator delay={0.2} staggerDelay={0.15}>
        <PageLoadAnimator.Item>
          <HeroSection />
        </PageLoadAnimator.Item>
        <PageLoadAnimator.Item>
          <ServicesSection />
        </PageLoadAnimator.Item>
        <PageLoadAnimator.Item>
          <BuildingProcess />
        </PageLoadAnimator.Item>
        <PageLoadAnimator.Item>
          <ProjectsShowcase />
        </PageLoadAnimator.Item>
        <PageLoadAnimator.Item>
          <AboutSection />
        </PageLoadAnimator.Item>
        <PageLoadAnimator.Item>
          <ContactSection />
        </PageLoadAnimator.Item>
      </PageLoadAnimator>
    </div>
  );
}
```

### Fast Animation

```tsx
<PageLoadAnimator delay={0} staggerDelay={0.08} duration={0.4}>
  <PageLoadAnimator.Item>Quick Item 1</PageLoadAnimator.Item>
  <PageLoadAnimator.Item>Quick Item 2</PageLoadAnimator.Item>
  <PageLoadAnimator.Item>Quick Item 3</PageLoadAnimator.Item>
</PageLoadAnimator>
```

### Slow, Dramatic Animation

```tsx
<PageLoadAnimator delay={0.5} staggerDelay={0.3} duration={1}>
  <PageLoadAnimator.Item>Dramatic Item 1</PageLoadAnimator.Item>
  <PageLoadAnimator.Item>Dramatic Item 2</PageLoadAnimator.Item>
  <PageLoadAnimator.Item>Dramatic Item 3</PageLoadAnimator.Item>
</PageLoadAnimator>
```

## Related Components

- `AnimateOnView` - Animates elements when they enter the viewport
- `Navigation` - Uses page load animations for initial appearance
- `HeroSection` - First element in the page load sequence

## Testing

The component includes comprehensive unit tests covering:
- Basic rendering
- Animation sequence configuration
- Natural easing functions
- Reduced motion support
- Custom props and styling
- Multiple items animation order
- Integration with page sections

Run tests with:
```bash
npm test -- page-load-animation.test.tsx
```
