import { NavLink } from 'react-router-dom';

function LinkButton(props) {
  const { to, text, stylings, onClick } = props;

  if (!stylings) {
    return (
      <NavLink to={`/${to}`}>
        <div className="flex items-center justify-center bg-white w-24 h-8 border-2 border-black rounded-lg hover:bg-opacity-50 transition-all duration-150 ease-in-out">
          {text}
        </div>
      </NavLink>
    );
  }
  return (
    <NavLink to={`/${to}`}>
      <div className={`${stylings} hover:bg-opacity-50 transition-all duration-150 ease-in-out`} onClick={onClick}>
        {text}
      </div>
    </NavLink>
  );
}

export default LinkButton;
