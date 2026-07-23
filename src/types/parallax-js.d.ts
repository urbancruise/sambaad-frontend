declare module 'parallax-js' {
  interface ParallaxOptions {
    relativeInput?: boolean;
    clipRelativeInput?: boolean;
    inputElement?: HTMLElement | string | null;
    hoverOnly?: boolean;
    scalarX?: number;
    scalarY?: number;
    frictionX?: number;
    frictionY?: number;
    originX?: number;
    originY?: number;
    calibrateX?: boolean;
    calibrateY?: boolean;
    invertX?: boolean;
    invertY?: boolean;
    limitX?: number | boolean;
    limitY?: number | boolean;
    pointerEvents?: boolean;
    selector?: string | null;
  }

  class Parallax {
    constructor(element: HTMLElement, options?: ParallaxOptions);
    enable(): void;
    disable(): void;
    destroy(): void;
    version(): string;
  }

  export default Parallax;
}