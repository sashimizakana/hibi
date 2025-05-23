import _ from "lodash";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { useAppTheme } from "@/lib/theme";
import { IconButton, TextInput } from "react-native-paper";
import { tasksAtom, saveTaskAtom } from "@/atoms/task";
import TaskEditor from "./Tasks/TaskEditor";

export default function Tasks({ date }: { date: string }) {
  const { colors } = useAppTheme();
  const tasks = useAtomValue(tasksAtom);
  const saveTask = useSetAtom(saveTaskAtom);
  const [newTask, setNewTask] = useState("");
  function add() {
    saveTask({
      name: newTask,
    });
    setNewTask("");
  }
  return (
    <View>
      {tasks.map((task, i) => {
        return <TaskEditor task={task} date={date} key={i}></TaskEditor>;
      })}
      <View style={styles.inputContainer}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
          value={newTask}
          outlineColor="transparent"
          underlineColor={colors.secondary}
          textColor={colors.text}
          onChangeText={setNewTask}
        />
        <IconButton
          icon="plus"
          iconColor={colors.primary}
          onPress={add}
          disabled={!newTask}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  todoContainer: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingTop: 10,
  },
});
