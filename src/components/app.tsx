import { A, Route, Router, useNavigate, useParams } from "@solidjs/router";
import { For, createSignal } from "solid-js";
import {
  PageTransitionProvider,
  usePageTransition,
} from "~/context/page-transition-ctx";
import { tw } from "~/utils/tw";
import { PageContainer } from "./page-container";

export const App = () => (
  <PageTransitionProvider>
    <Router>
      <Route path="/" component={Home} />
      <Route path="/list/:id" component={List} />
    </Router>
  </PageTransitionProvider>
);

const getBackground = (i: number): string => {
  const classes = [
    "bg-rose-950",
    "bg-rose-900",
    "bg-rose-800",
    "bg-rose-700",
    tw`bg-rose-600`,
    tw`
      bg-rose-600 relative overflow-y-hidden
      after:shadow-[0_0_50px_theme(colors.rose.500)]
      after:w-full after:h-full
      after:absolute
      after:left-0 after:top-[-100%]
    `,
  ];
  return classes[i] ?? classes.at(-1);
};

const Home = () => {
  const transition = usePageTransition();

  return (
    <Page id="home">
      <Header class={getBackground(0)}>All lists</Header>
      <ul>
        <For each={items()}>
          {(item, i) => (
            <li>
              {/* TODO: update & use "as" tw prop */}
              <A
                href={`list/${i()}`}
                class={tw`block ${itemStyles} ${getBackground(i() + 1)}`}
                onClick={() => transition.set("forwards")}
              >
                {item}
              </A>
            </li>
          )}
        </For>
        <InputListItem />
      </ul>
    </Page>
  );
};

const InputListItem = () => {
  let input: HTMLInputElement | undefined = undefined;
  const [inputFocused, setInputFocused] = createSignal(false);
  const defaultHeight = "2rem"; // matches line height of text-2xl
  const [height, setHeight] = createSignal(defaultHeight);

  return (
    <>
      <li
        class={tw`${itemStyles} box-content cursor-pointer ${
          inputFocused() && getBackground(items().length)
        }`}
        style={`height: ${height()};`}
        onClick={(e) => {
          console.log("click");
          input!.focus();
        }}
      >
        <textarea
          rows="1"
          wrap="soft"
          style={`height: ${height()};`}
          onFocusIn={() => setInputFocused(true)}
          onFocusOut={(e) => {
            setInputFocused(false);
            const v = e.target.value;
            if (v) {
              setItems((items) => [...items, v]);
              e.target.value = "";
              setHeight(defaultHeight);
            }
          }}
          ref={input}
          class={tw`bg-transparent outline-none w-full resize-none ${
            !inputFocused() && "cursor-pointer"
          }`}
          onInput={(e) => {
            console.log(e.target.value);
            setHeight("auto");
            setHeight(input!.scrollHeight + "px");
          }}
        />
      </li>
      {inputFocused() && <InputListItem />}
    </>
  );
};

const List = () => {
  const { id } = useParams();
  const item = items()[Number(id)];

  const navigate = useNavigate();

  const transition = usePageTransition();

  return (
    <Page id="list">
      <ul>
        <Header as="li" class={getBackground(0)}>
          {item}
        </Header>
        <li>
          <Item class={getBackground(1)}>TODO: Other items here...</Item>
        </li>
      </ul>
      <A
        href="/"
        class="fixed bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 h-[120px] w-[120px] bg-white rounded-full"
        onClick={(e) => {
          transition.set("backwards");
          // TODO: check if special key is pressed and can go back
          e.preventDefault();
          navigate(-1);
        }}
      />
    </Page>
  );
};

const Page = tw(PageContainer)`bg-black text-white bg-blue-950`;

// from-sky-500 to-sky-600
const Header = tw("div")`pb-6 pt-8 px-4 text-3xl`;
const itemStyles = tw`p-4 text-2xl`;
const Item = tw("div")`${itemStyles}`;

const [items, setItems] = createSignal([
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  // "eight",
  // "nine",
  // "ten",
  // "eleven",
]);
