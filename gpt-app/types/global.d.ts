import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "hotfx-shy-header": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
