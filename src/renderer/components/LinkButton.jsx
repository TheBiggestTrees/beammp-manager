import { NavLink } from 'react-router-dom';

function LinkButton(props) {
  const { to, text, stylings } = props;

  if (!stylings) {
    return (
      <NavLink to={`/${to}`}>
        <div className="flex items-center justify-center bg-white w-24 h-8 border-2 border-black rounded-lg">
          {text}
        </div>
      </NavLink>
    );
  }
  return (
    <NavLink to={`/${to}`}>
      <div className={stylings}>{text}</div>
    </NavLink>
  );
}

export default LinkButton;
