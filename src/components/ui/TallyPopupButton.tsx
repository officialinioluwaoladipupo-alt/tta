"use client";

import { useState } from "react";
import type { ReactNode, MouseEventHandler } from "react";

declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: {
        alignLeft?: boolean;
        overlay?: boolean;
        emoji?: { text: string; animation: "tada" };
        autoClose?: number;
        hiddenFields?: Record<string, string>;
        onSubmit?: (payload: unknown) => void;
      }) => void;
      closePopup?: (formId: string) => void;
    };
  }
}

interface TallyPopupButtonProps {
  children: ReactNode;
  className?: string;
  formId?: string;
  sessionContext?: { slug: string; title: string; number?: string; speakers?: string };
  thankYouMessage?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
}

export default function TallyPopupButton({
  children,
  className,
  formId = "9q8l55",
  sessionContext,
  thankYouMessage,
  onClick,
  "aria-label": ariaLabel,
}: TallyPopupButtonProps) {
  const [submitted, setSubmitted] = useState(false);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (thankYouMessage && window.Tally?.openPopup) {
      event.preventDefault();
      event.stopPropagation();
      setSubmitted(false);
      window.Tally.openPopup(formId, {
        alignLeft: true,
        overlay: true,
        emoji: { text: "👋", animation: "tada" },
        autoClose: 0,
        hiddenFields: sessionContext ? {
          sessionSlug: sessionContext.slug,
          sessionTitle: sessionContext.title,
          sessionNumber: sessionContext.number || "",
          speakers: sessionContext.speakers || "",
        } : undefined,
        onSubmit: () => {
          setSubmitted(true);
          window.Tally?.closePopup?.(formId);
        },
      });
    }
  };

  return (
    <>
      <button
        type="button"
        data-tally-open={formId}
        data-tally-align-left="1"
        data-tally-overlay="1"
        data-tally-emoji-text="👋"
        data-tally-emoji-animation="tada"
        data-tally-auto-close="0"
        data-tally-form-events-forwarding="1"
        data-session-slug={sessionContext?.slug}
        data-session-title={sessionContext?.title}
        data-session-number={sessionContext?.number}
        data-session-speakers={sessionContext?.speakers}
        className={className}
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {submitted && thankYouMessage && <p role="status" aria-live="polite" className="mt-4 text-sm font-semibold text-foreground/65">{thankYouMessage}</p>}
    </>
  );
}
