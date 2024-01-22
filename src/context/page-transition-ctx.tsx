import { JSXElement, createContext, useContext } from "solid-js";
import { Transition } from "solid-transition-group";

type TransitionDirection = "backwards" | "forwards";

const PageTransitionContext = createContext<{
  set: (v: TransitionDirection) => void;
}>({
  set: () => {},
});
export const usePageTransition = () => useContext(PageTransitionContext);

export const PageTransitionProvider = (p: { children?: JSXElement }) => {
  let transition: TransitionDirection | null = null;
  let onEntered: (() => void) | null = null;

  const animationOptions: EffectTiming = {
    duration: 500,
    easing: "ease-out",
  };
  return (
    <PageTransitionContext.Provider
      value={{
        set: (direction: TransitionDirection) => {
          transition = direction;
        },
      }}
    >
      <Transition
        onEnter={async (el, done) => {
          // const t = transition();
          // console.log("enter", t, el.id);
          // const _done = done;
          // done = () => {
          //   console.log("enter end", t, el.id);
          //   _done();
          // };

          if (transition === "forwards") {
            // append last
            el.parentNode!.append(el);
            await el.animate({ scale: [0, 1] }, animationOptions).finished;
          }
          if (transition === "backwards") {
            await el.animate({ scale: [2, 1] }, animationOptions).finished;
          }
          done();
          onEntered?.();
          onEntered = null;
          transition = null;
        }}
        onExit={async (el, done) => {
          // const t = transition();
          // console.log("exit", t, el.id);
          // const _done = done;
          // done = () => {
          //   console.log("exit end", t, el.id);
          //   _done();
          // };

          onEntered = done;

          if (transition === "forwards") {
            await el.animate({ scale: [1, 2] }, animationOptions).finished;
          }
          if (transition === "backwards") {
            await el.animate({ scale: [1, 0] }, animationOptions).finished;
          }
        }}
      >
        {p.children}
      </Transition>
    </PageTransitionContext.Provider>
  );
};
