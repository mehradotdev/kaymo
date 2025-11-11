import styles from "./index.module.css";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
}

const Button = (props: Props) => {
  const { title, icon } = props;
  return (
    <button {...props} className={styles.button}>
      <span>{title}</span>
      {icon && <span>{icon}</span>}
    </button>
  );
};

export default Button;
