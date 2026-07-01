"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  fadeIn,
  fadeUp,
  pageReveal,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/app/lib/motion";

const variants = {
  fadeIn,
  fadeUp,
  pageReveal,
  staggerContainer,
  staggerItem,
};

export function MotionBlock({
  as = "div",
  variant = "fadeUp",
  className = "",
  children,
  delay = 0,
  viewport = true,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;
  const selected = variants[variant] || fadeUp;
  const transition = delay
    ? { transition: { delay } }
    : undefined;

  if (reduceMotion) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      variants={selected}
      initial="hidden"
      {...(viewport
        ? { whileInView: "visible", viewport: viewportOnce }
        : { animate: "visible" })}
      {...transition}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MotionList({ className = "", children, as = "div", ...props }) {
  return (
    <MotionBlock
      as={as}
      variant="staggerContainer"
      className={className}
      {...props}
    >
      {children}
    </MotionBlock>
  );
}

export function MotionItem({ className = "", children, as = "div", ...props }) {
  return (
    <MotionBlock
      as={as}
      variant="staggerItem"
      className={className}
      {...props}
    >
      {children}
    </MotionBlock>
  );
}
