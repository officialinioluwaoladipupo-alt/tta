"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

interface JoinCommunityButtonProps {
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export default function JoinCommunityButton({
  children = "Join Community Now",
  className = "",
  showIcon = true,
}: JoinCommunityButtonProps) {
  return (
    <Link
      href="https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO"
      target="_blank"
      rel="noreferrer"
      className={`btn-primary text-xl lg:text-2xl px-8 py-4 lg:px-16 lg:py-6 inline-flex group items-center ${className}`}
    >
      {children}
      {showIcon && <ArrowRight className="group-hover:translate-x-2 transition-transform ml-2" />}
    </Link>
  );
}
