import PropTypes from "prop-types";

const CardContent = ({ children }) => {
    return <div className="p-2">{children}</div>;
};

CardContent.propTypes = {
    children: PropTypes.node.isRequired
};

export default CardContent;
