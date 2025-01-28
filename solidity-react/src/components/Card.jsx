import PropTypes from "prop-types";

const Card = ({ children }) => {
    return (
        <div className="border rounded-2xl p-4 shadow-lg bg-white">
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired
};

export default Card;
