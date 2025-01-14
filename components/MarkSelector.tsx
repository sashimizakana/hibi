import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

interface MarkSelectorProps {
  color: string;
  isActive: boolean;
  onToggle: (newState: boolean) => void;
}

const MarkSelector: React.FC<MarkSelectorProps> = ({
  color,
  isActive,
  onToggle,
}) => {
  const toggleMark = () => {
    onToggle(!isActive);
  };

  return (
    <TouchableOpacity onPress={toggleMark}>
      <Text style={[style.mark, { color: color }]}>{isActive ? "●" : "○"}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  mark: {
    fontSize: 30,
  },
});

export default MarkSelector;
