/** Shared Tailwind classes for auth screens (aligned with login). */

export const authBrandClassName =
  "mb-5 text-center text-lg font-semibold tracking-tight text-foreground";

export const authTitleClassName =
  "mb-5 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-[1.625rem]";

export const authSubtitleClassName =
  "mb-4 text-balance text-center text-sm leading-relaxed text-muted-foreground sm:mb-5";

export const authBodyClassName = "text-center text-sm leading-relaxed text-muted-foreground";

export const authLabelClassName = "text-sm font-medium text-foreground";

export const authInputClassName =
  "h-11 rounded-xl border-input bg-card px-3.5 text-sm shadow-none focus-visible:ring-1 sm:h-12 sm:text-[0.9375rem]";

export const authInputPasswordClassName = `${authInputClassName} pr-11 sm:pr-12`;

export const authOutlineButtonClassName =
  "h-11 w-full rounded-xl border-input bg-card px-4 text-sm font-medium text-card-foreground shadow-none hover:bg-secondary sm:h-12 sm:text-[0.9375rem]";

export const authPrimaryButtonClassName =
  "h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-none hover:bg-primary/85 disabled:bg-muted-foreground disabled:text-primary-foreground disabled:opacity-55 sm:h-12 sm:text-[0.9375rem]";

export const authSubmitButtonClassName = `mt-4 ${authPrimaryButtonClassName}`;

export const authFooterTextClassName =
  "mt-5 text-center text-sm font-medium text-foreground sm:mt-6";

export const authInlineLinkClassName =
  "font-semibold underline underline-offset-2 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export const authMutedNavLinkClassName =
  "text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:text-sm";

export const authDividerClassName = "my-5 h-px w-full bg-border sm:my-6";
