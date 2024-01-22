import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
// import { twMerge } from 'tailwind-merge'

/**
 * 
 * @ settings.json for autocomplete & lint for TW extension
 * 
 *     "tailwindCSS.classAttributes": [
        "class",
        "className",
        "ngClass",
    ],
    "tailwindCSS.experimental.classRegex": [
        // "tw`([^`]*)", // tw`...`
        // "tw\\.[^`]+`([^`]*)`", // tw.xxx<xxx>`...`
        // "tw\\(.*?\\).*?`([^`]*)" // tw(Component)<xxx>`...`
        // "tw\\(.*?\\).*?`([^`]*)" // tw(Component)<xxx>`...`
        "tw\\(.*?\\)(?:<.*?>)?`([^`]*)`" // tw(Component)<xxx>`...`
    ]
 */

export const tw = ((
  classesOrComponent:
    | keyof JSX.IntrinsicElements
    | ((p: {}) => JSX.Element)
    | TemplateStringsArray,
  ...args: any[]
) => {
  if (isTemplateStringArr(classesOrComponent)) {
    return classesOrComponent
      .flatMap((style, i) => [cleanupClasses(style), args[i] ?? ""])
      .filter(Boolean)
      .join(" ");
  }

  const Component = classesOrComponent;

  return (classes: TemplateStringsArray, ...args: TagArg<any>[]) => {
    const preprocessedValues = classes.flatMap((str, i) => [
      cleanupClasses(str),
      i === classes.length - 1
        ? (props: any) => props.class
        : preprocessArg(args[i]),
    ]);

    return (props: any) => {
      const [, p2] = splitProps(props, ["class", "as"]);

      const final = () =>
        preprocessedValues
          .map((v) => (typeof v === "function" ? v(props) : v))
          .filter(Boolean)
          .join(" ");

      return (
        <Dynamic component={props.as ?? Component} class={final()} {...p2} />
      );
    };
  };
}) as Tw;

const isTemplateStringArr = (v: any): v is TemplateStringsArray =>
  Array.isArray(v) && "raw" in v;

const preprocessArg = (
  arg: TagArg<any>
): string | ((props: any) => string | Falsy) =>
  typeof arg === "string"
    ? cleanupClasses(arg)
    : typeof arg === "function"
    ? (props: any) => {
        const v = arg(props);
        return v && cleanupClasses(v);
      }
    : (() => {
        throw `Unsupported type: ${typeof arg}`;
      })();

const cleanupClasses = (template: string): string => {
  return template
    .split("\n")
    .map((key: string) => {
      return key.trim().replace(/^\s+|\s+$/gm, "");
    })
    .filter(Boolean)
    .join(" ");
};

type Falsy = false | null | undefined | 0 | "";

type TagArg<P> = string | ((props: P) => string | Falsy);

type InternalProps = {
  as?: keyof JSX.IntrinsicElements | ((p: {}) => JSX.Element);
};

type TagFn<BaseProps extends {}> = <ExtraProps extends {} = {}>(
  classes: TemplateStringsArray,
  ...args: TagArg<ExtraProps>[]
) => (
  // TODO: support conditional props based on "as" internal prop.
  // i.e. "as" component function accepts certtain props that become "BaseProps"
  props: BaseProps & ExtraProps & InternalProps
) => JSX.Element;

type Tw = {
  <K extends keyof JSX.IntrinsicElements>(component: K): TagFn<
    JSX.IntrinsicElements[K]
  >;
  <P extends { class?: string }>(component: (p: P) => JSX.Element): TagFn<P>;
  // return css class, use for autocomplete purposes
  (
    styles: TemplateStringsArray,
    ...args: (string | number | false | null | undefined)[]
  ): string;
};
