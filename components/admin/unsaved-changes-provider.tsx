"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef } from "react";

type UnsavedChangesContextValue = {
  setHasUnsavedChanges: (value: boolean) => void;
  confirmNavigation: () => boolean;
  allowNavigation: () => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

const DEFAULT_MESSAGE = "Bạn có dữ liệu chưa lưu. Bạn có chắc muốn rời trang hoặc tải lại không?";

function isNavigationLink(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const anchor = target.closest("a[href]");

  if (!(anchor instanceof HTMLAnchorElement)) {
    return null;
  }

  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return null;
  }

  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
    return null;
  }

  return anchor;
}

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const hasUnsavedChangesRef = useRef(false);
  const allowNavigationRef = useRef(false);
  const guardPushedRef = useRef(false);

  const value = useMemo<UnsavedChangesContextValue>(
    () => ({
      setHasUnsavedChanges(nextValue) {
        hasUnsavedChangesRef.current = nextValue;

        if (!nextValue) {
          allowNavigationRef.current = false;
          return;
        }

        if (!guardPushedRef.current) {
          window.history.pushState({ __adminUnsavedGuard: true }, "", window.location.href);
          guardPushedRef.current = true;
        }
      },
      confirmNavigation() {
        if (!hasUnsavedChangesRef.current || allowNavigationRef.current) {
          return true;
        }

        const confirmed = window.confirm(DEFAULT_MESSAGE);

        if (confirmed) {
          allowNavigationRef.current = true;
          hasUnsavedChangesRef.current = false;
        }

        return confirmed;
      },
      allowNavigation() {
        allowNavigationRef.current = true;
        hasUnsavedChangesRef.current = false;
      }
    }),
    []
  );

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasUnsavedChangesRef.current || allowNavigationRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = DEFAULT_MESSAGE;
    }

    function handleDocumentClick(event: MouseEvent) {
      const anchor = isNavigationLink(event.target);

      if (!anchor) {
        return;
      }

      const targetUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (targetUrl.href === currentUrl.href) {
        return;
      }

      if (!value.confirmNavigation()) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    function handlePopState() {
      if (!hasUnsavedChangesRef.current || allowNavigationRef.current) {
        return;
      }

      const confirmed = window.confirm(DEFAULT_MESSAGE);

      if (confirmed) {
        allowNavigationRef.current = true;
        hasUnsavedChangesRef.current = false;
        guardPushedRef.current = false;
        window.history.back();
        return;
      }

      window.history.pushState({ __adminUnsavedGuard: true }, "", window.location.href);
      guardPushedRef.current = true;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [value]);

  return <UnsavedChangesContext.Provider value={value}>{children}</UnsavedChangesContext.Provider>;
}

export function useUnsavedChangesRegistration(hasUnsavedChanges: boolean) {
  const context = useContext(UnsavedChangesContext);

  if (!context) {
    throw new Error("useUnsavedChangesRegistration must be used within UnsavedChangesProvider");
  }

  useEffect(() => {
    context.setHasUnsavedChanges(hasUnsavedChanges);

    return () => {
      context.setHasUnsavedChanges(false);
    };
  }, [context, hasUnsavedChanges]);

  return context.allowNavigation;
}

export function useUnsavedChangesNavigation() {
  const context = useContext(UnsavedChangesContext);

  if (!context) {
    throw new Error("useUnsavedChangesNavigation must be used within UnsavedChangesProvider");
  }

  return context;
}
