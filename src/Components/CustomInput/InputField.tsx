import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { AllColors } from "../../Constants/COLORS";
import metrics from "../../Constants/Metrics";
import { Fonts } from "../../Constants/Fonts";

interface InputFieldProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  ...rest
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.errorInput : null]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: AllColors.black,
    fontSize: 18,
    marginBottom: 6,
    fontFamily: Fonts.AfacadBold,
    marginHorizontal:15
  },
  input: {
    backgroundColor: AllColors.lightGray,
    borderRadius: metrics.hp1,
    fontSize: 18,
    color: AllColors.black,
    height: metrics.hp6,
    paddingLeft: metrics.hp2,
    marginHorizontal: 15,
    fontFamily: Fonts.AfacadRegular,
  },
  errorInput: {
    borderColor: AllColors.red,
    borderWidth: 1,
  },
  errorText: {
    color: AllColors.red,
    fontSize: 12,
    marginTop: 4,
    marginHorizontal:15
  },
});

export default InputField;
