import PropTypes from "prop-types";

const Input = ({ placeholder, value, onChange }) => {
    return (
        <input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full p-2 border rounded-lg"
        />
    );
};

Input.propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Input;
