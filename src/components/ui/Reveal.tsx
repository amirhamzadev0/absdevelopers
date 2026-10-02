"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealProps {
  as?: ElementType;
  /** Reveal children one after another instead of the block as a whole. */
  stagger?: boolean;
  className?: string;
  id?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
}

export function Reveal({
  as: Tag = "div",
  stagger = false,
  className = "",
  children,
  ...rest
}: RevealProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>(stagger ? 0.08 : 0.1);
  const classes = [className, stagger ? "reveal--stagger" : "reveal", revealed ? "is-revealed" : ""]
    .filter(Boolean)
    .join(" ");

  const content = stagger
    ? Children.map(children, (child, index) =>
        isValidElement<{ style?: CSSProperties }>(child)
          ? cloneElement(child as ReactElement<{ style?: CSSProperties }>, {
              style: { ...child.props.style, ["--i" as string]: Math.min(index, 12) },
            })
          : child,
      )
    : children;

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {content}
    </Tag>
  );
}
