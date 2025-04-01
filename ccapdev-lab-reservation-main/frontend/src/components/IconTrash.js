import { useNavigate } from 'react-router-dom';

const IconTrash = ({ reservation }) => {
  const navigate = useNavigate();
  
  return (
    <svg
      onClick={() => navigate(`/delete/${reservation._id}`)}
      className="cursor-pointer"
      stroke="2"
      color="#cc5f5f"
      viewBox="0 0 24 24"
    >
      {/* SVG icon path */}
    </svg>
  );
};

export default IconTrash;