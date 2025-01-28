import PropTypes from "prop-types";

const TextArea = ({ placeholder, value, onChange }) => {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full p-2 border rounded-lg"
        />
    );
};

TextArea.propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default TextArea;
