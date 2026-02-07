# AnimateOnView Component Documentation

## Overview

The `AnimateOnView` component is a powerful wrapper that triggers animations when elements enter the viewport. It uses the IntersectionObserver API for efficient viewport detection and Framer Motion for smooth animations.

## Features

- ✅ Automatic viewport detection using IntersectionObserver
- ✅ Multiple animation variants (fadeInUp, fadeIn, scaleIn, slideInUp)
- ✅ Custom animation support
- ✅ Staggered children animations
- ✅ Reduced motion support for accessibility
- ✅ Configurable thresholds and margins
- ✅ Once or repeating animations
- ✅ TypeScript support

## Components

### AnimateOnView

The main component for viewport-triggered animations.

```tsx
import { AnimateOnView } from '@/components/AnimateOnView';

<AnimateOnView
  variant="fadeInUp"
  stagger={false}
  delay={0}
  rootMargin="-100px 0px"
  threshold={0.1}
  once={true}
  as="div"
  className="my-section"
>
  <h2>Animated Content</h2>
  <p>This content fades in when scrolled into view</p>
</AnimateOnView>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child elements to animate |
| `variant` | `'fadeInUp' \| 'fadeIn' \| 'scaleIn' \| 'slideInUp' \| 'custom'` | `'fadeInUp'` | Animation variant to use |
| `customVariants` | `Variants` | - | Custom Framer Motion variants (when variant is 'custom') |
| `stagger` | `boolean` | `false` | Whether to stagger children animations |
| `staggerDelay` | `number` | `0.1` | Delay between staggered children (seconds) |
| `delay` | `number` | `0` | Delay before animation starts (seconds) |
| `rootMargin` | `string` | `'-100px 0px'` | IntersectionObserver root margin |
| `threshold` | `number` | `0.1` | IntersectionObserver threshold (0-1) |
| `once` | `boolean` | `true` | Whether to trigger animation only once |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | HTML element type to render |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Additional inline styles |

### AnimateOnViewItem

Wrapper for individual items in a staggered animation. Use as children of `AnimateOnView` with `stagger={true}`.

```tsx
import { AnimateOnView, AnimateOnViewItem } from '@/components/AnimateOnView';

<AnimateOnView stagger={true} staggerDelay={0.15}>
  <AnimateOnViewItem>
    <div>Item 1</div>
  </AnimateOnViewItem>
  <AnimateOnViewItem>
    <div>Item 2</div>
  </AnimateOnViewItem>
  <AnimateOnViewItem>
    <div>Item 3</div>
  </AnimateOnViewItem>
</AnimateOnView>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child elements |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Additional inline styles |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | HTML element type to render |

### FadeInUp

Pre-configured component for fade-in-up animation.

```tsx
import { FadeInUp } from '@/components/AnimateOnView';

<FadeInUp delay={0.2}>
  <h2>Fades in from bottom</h2>
</FadeInUp>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child elements |
| `delay` | `number` | `0` | Delay before animation starts (seconds) |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Additional inline styles |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | HTML element type to render |

### StaggerChildren

Pre-configured component for staggered children animations.

```tsx
import { StaggerChildren, AnimateOnViewItem } from '@/components/AnimateOnView';

<StaggerChildren staggerDelay={0.1}>
  <AnimateOnViewItem>
    <div>Item 1</div>
  </AnimateOnViewItem>
  <AnimateOnViewItem>
    <div>Item 2</div>
  </AnimateOnViewItem>
</StaggerChildren>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child elements (should be AnimateOnViewItem) |
| `staggerDelay` | `number` | `0.1` | Delay between children (seconds) |
| `delay` | `number` | `0` | Delay before first child animates (seconds) |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Additional inline styles |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | HTML element type to render |

## Usage Examples

### Basic Fade-In

```tsx
<AnimateOnView>
  <section className="py-20">
    <h2>About Us</h2>
    <p>We are a construction company...</p>
  </section>
</AnimateOnView>
```

### Staggered List

```tsx
<StaggerChildren staggerDelay={0.15}>
  {services.map((service) => (
    <AnimateOnViewItem key={service.id}>
      <ServiceCard {...service} />
    </AnimateOnViewItem>
  ))}
</StaggerChildren>
```

### Custom Animation

```tsx
const customVariants = {
  initial: { opacity: 0, x: -100, rotate: -10 },
  animate: { opacity: 1, x: 0, rotate: 0 },
};

<AnimateOnView variant="custom" customVariants={customVariants}>
  <div>Custom animated content</div>
</AnimateOnView>
```

### Different Variants

```tsx
// Fade in
<AnimateOnView variant="fadeIn">
  <div>Fades in</div>
</AnimateOnView>

// Scale in
<AnimateOnView variant="scaleIn">
  <div>Scales in</div>
</AnimateOnView>

// Slide in from bottom
<AnimateOnView variant="slideInUp">
  <div>Slides in from bottom</div>
</AnimateOnView>
```

### Custom Trigger Point

```tsx
// Trigger when element is 50% visible
<AnimateOnView threshold={0.5}>
  <div>Content</div>
</AnimateOnView>

// Trigger earlier (200px before entering viewport)
<AnimateOnView rootMargin="200px 0px">
  <div>Content</div>
</AnimateOnView>
```

### Repeating Animation

```tsx
// Animation triggers every time element enters viewport
<AnimateOnView once={false}>
  <div>Animates every time</div>
</AnimateOnView>
```

### With Delay

```tsx
<FadeInUp delay={0.3}>
  <h2>Appears after 0.3 seconds</h2>
</FadeInUp>
```

### Semantic HTML

```tsx
<AnimateOnView as="section" className="hero">
  <h1>Hero Title</h1>
</AnimateOnView>

<AnimateOnView as="article" className="blog-post">
  <h2>Article Title</h2>
</AnimateOnView>
```

## Accessibility

The component automatically respects the user's `prefers-reduced-motion` setting:

- When reduced motion is enabled, animations are replaced with instant transitions
- This ensures the site remains accessible to users with motion sensitivity
- No additional configuration needed

## Performance

- Uses IntersectionObserver for efficient viewport detection
- Animations only trigger when elements are near the viewport
- Automatic cleanup on component unmount
- Optimized for 60 FPS animations

## Browser Support

- Modern browsers with IntersectionObserver support
- Polyfill available for older browsers if needed
- Graceful degradation: content still visible without animations

## Best Practices

1. **Use `once={true}` by default** - Animations should typically trigger only once
2. **Keep stagger delays short** - 0.05-0.15 seconds works well
3. **Don't overuse animations** - Animate key sections, not everything
4. **Test with reduced motion** - Always verify accessibility
5. **Use semantic HTML** - Set appropriate `as` prop for SEO
6. **Adjust thresholds** - Fine-tune when animations trigger for best UX

## Related Hooks

### useInView

Low-level hook for viewport detection:

```tsx
import { useInView } from '@/lib/animations/use-in-view';

function MyComponent() {
  const [ref, isInView] = useInView({
    rootMargin: '-100px 0px',
    threshold: 0.1,
    once: true,
  });

  return (
    <div ref={ref}>
      {isInView ? 'In view!' : 'Not in view'}
    </div>
  );
}
```

### useInViewFadeIn

Pre-configured hook for fade-in animations:

```tsx
import { useInViewFadeIn } from '@/lib/animations/use-in-view';

function MyComponent() {
  const [ref, isInView] = useInViewFadeIn();

  return <div ref={ref}>Content</div>;
}
```

### useInViewStagger

Pre-configured hook for stagger animations:

```tsx
import { useInViewStagger } from '@/lib/animations/use-in-view';

function MyComponent() {
  const [ref, isInView] = useInViewStagger();

  return <div ref={ref}>Content</div>;
}
```

## Troubleshooting

### Animation not triggering

1. Check that element is actually entering viewport
2. Verify `rootMargin` and `threshold` settings
3. Ensure `once={true}` hasn't already triggered
4. Check browser console for errors

### Animation too fast/slow

Adjust the animation duration in the variant or use custom variants:

```tsx
const slowVariants = {
  initial: { opacity: 0, y: 60 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2 }
  },
};

<AnimateOnView variant="custom" customVariants={slowVariants}>
  <div>Slow animation</div>
</AnimateOnView>
```

### Stagger not working

Make sure to use `AnimateOnViewItem` as direct children:

```tsx
// ✅ Correct
<StaggerChildren>
  <AnimateOnViewItem><div>Item 1</div></AnimateOnViewItem>
  <AnimateOnViewItem><div>Item 2</div></AnimateOnViewItem>
</StaggerChildren>

// ❌ Incorrect
<StaggerChildren>
  <div>Item 1</div>
  <div>Item 2</div>
</StaggerChildren>
```

## Testing

The component includes comprehensive property-based tests. See `__tests__/viewport-entrance-animations.test.tsx` for examples.

## License

Part of the SB Infra Projects landing page.
