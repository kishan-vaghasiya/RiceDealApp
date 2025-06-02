import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  GestureResponderEvent,
  TextInput,
  ImageBackground,
  Platform,
} from "react-native";
import style from "./style";
import { Images } from "../../Assets/Images";
import { AllColors } from "../../Constants/COLORS";
import metrics from "../../Constants/Metrics";

export type props = {
  onPressButton: (event: string) => void;
  button1: string;
  icon1?: JSX.Element;
  button2: string;
  icon2?: JSX.Element;
  activeButton: string;
};

export const CustomTopBar: React.FC<props> = ({
  button1,
  button2,
  onPressButton,
  icon1,
  icon2,
  activeButton,
}) => {
  return (
    <View style={style.viewmain}>
      <View style={style.viewRow}>
        <View style={[style.viewFlex]}>
          <TouchableOpacity
            style={[style.viewButtonContainer]}
            onPress={() => onPressButton(button1)}
          >
           
              {icon1}
              <Text
                style={[
                  style.textButton,
                  {
                    opacity: activeButton == button1 ? 1 : 0.5,
                    color:
                      activeButton == button1
                        ? AllColors.black
                        : AllColors.subText,
                  },
                ]}
              >
                {button1}
              </Text>
          </TouchableOpacity>
        </View>
        <View style={style.viewFlex}>
          <TouchableOpacity
            style={style.viewButtonContainer}
            onPress={() => onPressButton(button2)}
          >
          
              {icon2}
              <Text
                style={[
                  style.textButton,
                  {
                    opacity: activeButton == button2 ? 1 : 0.5,
                    color:
                      activeButton == button2
                        ? AllColors.black
                        : AllColors.subText,
                  },
                ]}
              >
                {button2}
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
