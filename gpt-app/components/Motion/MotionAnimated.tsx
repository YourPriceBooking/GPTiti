"use client";

import { motion, MotionProps } from "framer-motion";
import React, { JSX } from "react";

interface AnimatedBlockProps extends MotionProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
  amount?: number;
  yFrom?: number;
  duration?: number;
  delay?: number;
  disabled?:boolean;
}

export default function AnimatedBlock({
  children,
  as: Tag = "div",
  className = "",
  once = true,
  amount = 0.2,
  yFrom = 20,
  duration = 0.6,
  ...rest
}: AnimatedBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yFrom }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, ease: "easeOut" }}
      className={className}
      {...rest}
    >
      <Tag>{children}</Tag>
    </motion.div>
  );
}