"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Parallax from "parallax-js";

export default function UnauthorizedPage() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    let parallaxInstance: any = null;

    if (sceneRef.current) {
      parallaxInstance = new Parallax(sceneRef.current);
    }

    return () => {
      if (parallaxInstance) {
        parallaxInstance.destroy();
      }
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#695681]">
      <section className="
        flex
        h-screen
        items-center
        justify-center
      ">

        <div className="relative h-screen w-screen">

          <div
            ref={sceneRef}
            id="scene"
            className="absolute inset-0"
          >

            {/* Main circle */}
            <div
              data-depth="1.2"
              className="
                absolute
                left-[20%]
                top-[20%]
                h-[60%]
                w-[60%]
              "
            >
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-[800px]
                  w-[800px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#36184F]/30
                  shadow-[inset_5px_20px_40px_rgba(54,24,79,.25)]
                  animate-pulse
                "
              />
            </div>

            {/* Floating pieces */}
            <div
              data-depth="0.9"
              className="absolute left-[20%] top-[20%]"
            >
              <div className="
                h-[600px]
                w-[600px]
                rounded-full
                bg-[#36184F]/30
              "/>
            </div>

            <div
              data-depth="0.6"
              className="
                absolute
                left-[20%]
                top-[20%]
              "
            >
              <div className="
                h-[600px]
                w-[600px]
                rounded-full
                bg-gradient-to-r
                from-[#FFEDC0]
                to-[#FF9D87]
                opacity-30
              "/>
            </div>

            <div
              data-depth="0.4"
              className="
                absolute
                left-[20%]
                top-[20%]
              "
            >
              <div className="
                h-[600px]
                w-[600px]
                rounded-full
                bg-[#FB8A8A]/40
              "/>
            </div>

            {/* 403 Access Denied Indicator */}
            <p
              data-depth="0.5"
              className="
                absolute
                left-[20%]
                top-[20%]
                flex
                h-[60%]
                w-[60%]
                items-center
                justify-center
                text-[200px]
                font-bold
                tracking-widest
                text-white
                animate-zoom404
              "
            >
              403
            </p>

            <p
              data-depth="0.1"
              className="
                absolute
                left-[20%]
                top-[20%]
                flex
                h-[60%]
                w-[60%]
                items-center
                justify-center
                text-[200px]
                font-bold
                tracking-widest
                text-[#36184F]
                blur-md
              "
            >
              403
            </p>

          </div>

          {/* Content */}
          <div className="
            absolute
            bottom-20
            left-1/2
            z-20
            -translate-x-1/2
            text-center
            w-full
            px-4
          ">

            <p className="
              mb-10
              text-lg
              tracking-wide
              text-white
              drop-shadow-xl
            ">
              Uh oh! You don't have permission to view this workspace.
              <br/>
              Go back to the homepage if you dare!
            </p>

            <button
              onClick={() => router.replace("/")}
              className="
                rounded-full
                bg-white
                px-8
                py-3
                text-xs
                font-semibold
                uppercase
                text-[#695681]
                shadow-xl
                transition
                hover:-translate-y-1
                hover:bg-[#FB8A8A]
                hover:text-white
                active:scale-95
              "
            >
              i dare!
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}