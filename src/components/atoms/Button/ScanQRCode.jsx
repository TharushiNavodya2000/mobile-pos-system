import { View } from "react-native";
import React from "react";
import { Button } from "@rneui/themed";
import PropTypes from "prop-types";
import { BASIC_COLORS } from "../../../utils/constants/styles";

const SQCButton = ({
  buttonTitle,
  buttonType,
  buttonStyle,
  buttonContainerStyle,
  onPress,
  loading,
  icon,
}) => {
  return (
    <View>
      <Button
        title={buttonTitle}
        titleStyle={{
          color:
            buttonType === "primary"
              ? BASIC_COLORS.WHITE
              : buttonType === "secondary"
              ? BASIC_COLORS.PRIMARY
              : BASIC_COLORS.ERROR,
          fontSize: 15,
        }}
        style={{}}
        buttonStyle={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          alignContent: "center",
          borderRadius: 10,
          height: 45,
          backgroundColor:
            buttonType === "primary"
              ? BASIC_COLORS.PRIMARY
              : buttonType === "secondary"
              ? "none"
              : "none",
          borderColor:
            buttonType === "error" ? BASIC_COLORS.ERROR : BASIC_COLORS.PRIMARY,
          borderWidth: 3,
          ...buttonStyle,
        }}
        iconPosition="right"
        icon={icon}
        iconRight={true}
        onPress={onPress}
        loading={loading}
      />
    </View>
  );
};

SQCButton.propTypes = {
  buttonTitle: PropTypes.string,
  buttonType: PropTypes.oneOf(["primary", "secondary", "error"]),
  buttonContainerStyle: PropTypes.object,
  onPress: PropTypes.func,
  buttonStyle: PropTypes.object,
  loading: PropTypes.bool,
  icon: PropTypes.element,
};

SQCButton.defaultProps = {
  buttonTitle: "Button",
  buttonType: "primary",
  buttonContainerStyle: {},
  onPress: () => {},
  buttonStyle: {},
  loading: false,
};

export default SQCButton;
