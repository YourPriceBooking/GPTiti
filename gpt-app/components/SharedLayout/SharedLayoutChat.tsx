import css from "./SharedLayoutChat.module.css";

type SharedLayoutChatProps = {
  children: React.ReactNode;
};

export default function SharedLayoutChat({ children }: SharedLayoutChatProps) {
  return <div className={css.container}>{children}</div>;
}
