import { Link } from 'react-router-dom';

function LinkButton(props) {
  const { to, text } = props;

  return (
    <Link to={`/${to}`}>
      <div className="flex items-center justify-center bg-white w-24 h-8 border-2 border-black rounded-lg">
        {text}
      </div>
    </Link>
  );
}

export default LinkButton;
